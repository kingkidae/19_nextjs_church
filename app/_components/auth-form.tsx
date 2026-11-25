"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signInWithGoogle, signUp } from "../_lib/auth-actions";

export default function AuthForm({ mode, next = "/", error }: { mode: "login" | "signup"; next?: string; error?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, undefined);
  const message = state?.error ?? error;

  if (state?.notice)
    return (
      <div role="status" className="space-y-4">
        <p className="font-serif text-[clamp(1.2rem,3svh,1.6rem)] leading-snug">메일함을 확인해 주세요.</p>
        <p className="text-sm leading-relaxed text-champagne/80">{state.notice}</p>
        <Link href="/login" className="inline-block text-sm text-amber underline-offset-4 hover:underline">로그인으로 돌아가기</Link>
      </div>
    );

  return (
    <div className="space-y-[2.6svh]">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button className="flex w-full items-center justify-center gap-3 rounded-full bg-champagne py-3 text-sm font-medium text-mocha-night transition-colors hover:bg-white">
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9Z" />
          </svg>
          Google로 {mode === "login" ? "로그인" : "가입하기"}
        </button>
        {mode === "signup" && (
          <p className="mt-2 text-center text-xs leading-relaxed text-champagne/60">
            Google로 가입하면 만 14세 이상이며 <Link href="/terms" target="_blank" className="underline underline-offset-2">이용약관</Link>과{" "}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2">개인정보 처리방침</Link>에 동의한 것으로 봅니다.
          </p>
        )}
      </form>

      <p className="flex items-center gap-4 text-xs text-champagne/50 before:h-px before:flex-1 before:bg-champagne/20 after:h-px after:flex-1 after:bg-champagne/20">또는 이메일로</p>

      <form action={action} className="space-y-[1.8svh]">
        <input type="hidden" name="next" value={next} />
        {mode === "signup" && (
          <label className="grid gap-1.5 text-sm">
            이름
            <input name="name" required maxLength={30} autoComplete="name" defaultValue={state?.values?.name} className="field-dark" />
          </label>
        )}
        <label className="grid gap-1.5 text-sm">
          이메일
          <input name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email} className="field-dark" />
        </label>
        <label className="grid gap-1.5 text-sm">
          비밀번호{mode === "signup" && <span className="text-xs text-champagne/50">8자 이상</span>}
          <input name="password" type="password" required minLength={mode === "signup" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} className="field-dark" />
        </label>
        {mode === "signup" && (
          <label className="grid gap-1.5 text-sm">
            비밀번호 확인
            <input name="password2" type="password" required autoComplete="new-password" className="field-dark" />
          </label>
        )}
        {mode === "signup" && (
          <label className="flex items-start gap-2.5 text-sm leading-relaxed text-champagne/85">
            <input type="checkbox" name="agree" required className="mt-1 size-4 accent-amber" />
            <span>
              [필수] 만 14세 이상이며,{" "}
              <Link href="/terms" target="_blank" className="underline underline-offset-4 hover:text-amber">이용약관</Link>과{" "}
              <Link href="/privacy" target="_blank" className="underline underline-offset-4 hover:text-amber">개인정보 처리방침</Link>에 동의합니다.
            </span>
          </label>
        )}
        {message && <p role="alert" className="text-sm text-amber">{message}</p>}
        <button disabled={pending} className="w-full rounded-full bg-amber py-3 text-sm font-medium text-mocha-night transition-colors hover:bg-champagne disabled:opacity-60">
          {pending ? "확인하는 중…" : mode === "login" ? "로그인" : "가입하기"}
        </button>
      </form>

      <p className="text-center text-sm text-champagne/70">
        {mode === "login" ? (
          <>처음 오셨나요? <Link href="/signup" className="text-champagne underline underline-offset-4">회원가입</Link></>
        ) : (
          <>이미 가입하셨나요? <Link href="/login" className="text-champagne underline underline-offset-4">로그인</Link></>
        )}
      </p>
    </div>
  );
}
