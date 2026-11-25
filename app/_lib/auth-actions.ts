"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fail, type FormState } from "./form-state";
import { safeNext } from "./safe-next";
import { afterLogin, createClient } from "./supabase";

export type { FormState } from "./form-state";

const origin = async () => (await headers()).get("origin") ?? "http://localhost:3000";

const KO: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 맞지 않습니다.",
  "Email not confirmed": "이메일 인증이 아직 끝나지 않았습니다. 메일함의 인증 링크를 눌러 주세요.",
  "User already registered": "이미 가입된 이메일입니다. 로그인해 주세요.",
};
const ko = (msg: string) => KO[msg] ?? msg;

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return fail(form, "이메일과 비밀번호를 입력해 주세요.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail(form, ko(error.message));
  redirect(await afterLogin(supabase, data.user.id, safeNext(form.get("next"))));
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!name || name.length > 30) return fail(form, "이름을 30자 이내로 입력해 주세요.");
  if (!email) return fail(form, "이메일을 입력해 주세요.");
  if (password.length < 8) return fail(form, "비밀번호는 8자 이상이어야 합니다.");
  if (password !== form.get("password2")) return fail(form, "비밀번호 확인이 일치하지 않습니다.");
  if (!form.get("agree")) return fail(form, "이용약관과 개인정보 처리방침에 동의해야 가입할 수 있습니다.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${await origin()}/auth/callback` },
  });
  if (error) return fail(form, ko(error.message));
  if (data.session) redirect("/profile?welcome=1");
  return { notice: `${email}로 인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 끝납니다.` };
}

export async function signInWithGoogle(form: FormData) {
  const supabase = await createClient();
  const next = safeNext(form.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/login?error=${encodeURIComponent("Google 로그인을 시작하지 못했습니다.")}`);
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
