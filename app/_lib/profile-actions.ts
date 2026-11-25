"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { fail, type FormState } from "./form-state";
import { safeNext } from "./safe-next";
import { createClient, displayName } from "./supabase";

const MAX_AVATAR = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const optional = (v: FormDataEntryValue | null) => String(v ?? "").trim() || null;

export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  const phone = optional(form.get("phone"));
  const birthday = optional(form.get("birthday"));
  const address = optional(form.get("address"));
  // same rules as the CHECK constraints in schema.sql, checked here for friendly messages
  if (!name || name.length > 30) return fail(form, "이름을 30자 이내로 입력해 주세요.");
  if (phone && !/^[0-9+() -]{7,20}$/.test(phone)) return fail(form, "휴대폰 번호는 숫자와 - 만 써서 입력해 주세요.");
  if (birthday && (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || birthday < "1900-01-01" || new Date(birthday) > new Date()))
    return fail(form, "생년월일을 다시 확인해 주세요.");
  if (address && address.length > 200) return fail(form, "주소는 200자 이내로 입력해 주세요.");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/profile");

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: auth.user.id, name, phone, birthday, address, updated_at: new Date().toISOString() });
  if (error) return fail(form, "저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  // keep the name shown in the header and on posts in sync
  if (displayName(auth.user) !== name) await supabase.auth.updateUser({ data: { name } });

  if (form.get("welcome")) redirect(safeNext(form.get("next")));
  refresh();
  return { notice: "저장했습니다." };
}

export async function uploadAvatar(_: FormState, form: FormData): Promise<FormState> {
  const file = form.get("avatar");
  if (!(file instanceof File) || file.size === 0) return fail(form, "사진 파일을 골라 주세요.");
  if (!IMAGE_TYPES.includes(file.type)) return fail(form, "JPG, PNG, WEBP, GIF 사진만 올릴 수 있습니다.");
  if (file.size > MAX_AVATAR) return fail(form, "사진은 5MB 이하만 올릴 수 있습니다.");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/profile");

  // one file per member, overwritten on change; storage policy only allows their own folder
  const path = `${auth.user.id}/avatar`;
  const up = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });
  if (up.error) return fail(form, "사진을 올리지 못했습니다. 잠시 후 다시 시도해 주세요.");

  const url = `${supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  const { data: updated } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", auth.user.id).select("id");
  if (!updated?.length) {
    const { error } = await supabase.from("profiles").insert({ id: auth.user.id, name: displayName(auth.user).slice(0, 30), avatar_url: url });
    if (error) return fail(form, "사진 정보를 저장하지 못했습니다.");
  }
  refresh();
  return { notice: "프로필 사진을 바꿨습니다." };
}
