import Image from "next/image";
import { Suspense } from "react";
import { supabaseReady } from "../_lib/supabase";
import AuthForm from "./auth-form";

type SP = Promise<Record<string, string | string[] | undefined>>;

async function FormWithParams({ mode, searchParams }: { mode: "login" | "signup"; searchParams: SP }) {
  const sp = await searchParams;
  return <AuthForm mode={mode} next={typeof sp.next === "string" ? sp.next : "/"} error={typeof sp.error === "string" ? sp.error : undefined} />;
}

export default function AuthScreen({ mode, searchParams }: { mode: "login" | "signup"; searchParams: SP }) {
  return (
    <main className="screen grid !p-0 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden lg:block">
        <Image src="/images/door.jpg" alt="" fill priority sizes="55vw" className="object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-mocha" />
        <blockquote className="absolute bottom-[10svh] left-[var(--gutter)] max-w-[22ch] font-serif text-[clamp(1.4rem,3.6svh,2.2rem)] leading-[1.5] text-champagne">
          문을 두드리라
          <br />
          그리하면 너희에게
          <br />
          열릴 것이니
          <cite className="mt-4 block font-sans text-sm not-italic text-amber">마태복음 7:7</cite>
        </blockquote>
      </div>
      <div className="flex items-center justify-center overflow-y-auto px-[var(--gutter)] pt-[var(--nav-h)]">
        <div className="w-full max-w-[24rem] py-[3svh]">
          <h1 className="mb-[3.5svh] font-serif text-[clamp(1.8rem,5.5svh,3rem)] text-champagne">{mode === "login" ? "로그인" : "회원가입"}</h1>
          {supabaseReady ? (
            <Suspense>
              <FormWithParams mode={mode} searchParams={searchParams} />
            </Suspense>
          ) : (
            <p className="text-sm leading-relaxed text-champagne/80">
              로그인 기능을 쓰려면 <code>.env.local</code>에 Supabase 키를 넣어야 합니다. 프로젝트의 <code>.env.example</code>을 참고하세요.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
