import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/app/_lib/safe-next";
import { afterLogin, createClient } from "@/app/_lib/supabase";

// Google OAuth and email-confirmation links land here with ?code=
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${await afterLogin(supabase, data.user.id, next)}`);
  }
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("인증 링크가 만료되었거나 올바르지 않습니다.")}`);
}
