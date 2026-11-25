"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { SETTINGS, TABLES, youtubeId, type Field, type SettingKey, type TableKey } from "./admin-fields";
import { fail, type FormState } from "./form-state";
import { CONTENT_TAG } from "./content";
import { createClient, isAdmin } from "./supabase";

// RLS (is_admin()) is the real gate; this gives a clear message and stops early.
async function adminClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/admin");
  if (!isAdmin(data.user)) redirect("/");
  return { supabase, user: data.user };
}

function readFields(fields: readonly Field[], form: FormData): { error: string } | { values: Record<string, string | number> } {
  const out: Record<string, string | number> = {};
  for (const f of fields) {
    const raw = String(form.get(f.name) ?? "").trim();
    if (!raw && !f.optional && f.type !== "number") return { error: `'${f.label}'을(를) 입력해 주세요.` };
    if (f.type === "number") {
      const n = Number(raw || 0);
      if (!Number.isInteger(n) || n < 0 || n > 9999) return { error: `'${f.label}'은(는) 0~9999 숫자로 입력해 주세요.` };
      out[f.name] = n;
      continue;
    }
    if (raw.length > (f.max ?? (f.type === "url" ? 2000 : 300))) return { error: `'${f.label}'이(가) 너무 깁니다.` };
    if (f.type === "url" && raw && !/^https:\/\/[^\s<>"]+$/.test(raw)) return { error: `'${f.label}'은(는) https:// 로 시작하는 주소여야 합니다.` };
    if (f.type === "select" && !f.options?.includes(raw)) return { error: `'${f.label}' 값이 올바르지 않습니다.` };
    if (f.pattern && raw && !new RegExp(f.pattern).test(raw)) return { error: `'${f.label}' 형식을 확인해 주세요. ${f.hint ?? ""}` };
    out[f.name] = raw;
  }
  return { values: out };
}

export async function saveSettings(_: FormState, form: FormData): Promise<FormState> {
  const key = String(form.get("_key")) as SettingKey;
  if (!(key in SETTINGS)) return fail(form, "잘못된 요청입니다.");
  const read = readFields(SETTINGS[key].fields, form);
  if (!("values" in read)) return fail(form, read.error);

  const { supabase } = await adminClient();
  const { error } = await supabase.from("site_settings").upsert({ key, value: read.values, updated_at: new Date().toISOString() });
  if (error) return fail(form, "저장하지 못했습니다. 관리자 권한을 확인해 주세요.");
  updateTag(CONTENT_TAG);
  refresh();
  return { notice: "저장했습니다. 사이트에 바로 반영됩니다." };
}

export async function saveRow(_: FormState, form: FormData): Promise<FormState> {
  const table = String(form.get("_table")) as TableKey;
  if (!(table in TABLES)) return fail(form, "잘못된 요청입니다.");
  const read = readFields(TABLES[table].fields, form);
  if (!("values" in read)) return fail(form, read.error);
  const values = read.values;
  if (table === "videos") {
    const id = youtubeId(String(values.youtube_id));
    if (!id) return fail(form, "YouTube 영상 주소를 확인해 주세요.");
    values.youtube_id = id;
  }

  const { supabase } = await adminClient();
  const id = Number(form.get("_id")) || null;
  const { error } = id ? await supabase.from(table).update(values).eq("id", id) : await supabase.from(table).insert(values);
  if (error) return fail(form, "저장하지 못했습니다. 입력값을 확인해 주세요.");
  updateTag(CONTENT_TAG);
  refresh();
  return { notice: id ? "저장했습니다." : "추가했습니다." };
}

export async function deleteRow(form: FormData) {
  const table = String(form.get("_table")) as TableKey;
  const id = Number(form.get("_id"));
  if (!(table in TABLES) || !Number.isInteger(id)) return;
  const { supabase } = await adminClient();
  await supabase.from(table).delete().eq("id", id);
  updateTag(CONTENT_TAG);
  refresh();
}

export async function setRole(form: FormData) {
  const target = String(form.get("user_id"));
  const makeAdmin = form.get("make_admin") === "1";
  const { supabase } = await adminClient();
  await supabase.rpc("admin_set_role", { target, make_admin: makeAdmin });
  refresh();
}
