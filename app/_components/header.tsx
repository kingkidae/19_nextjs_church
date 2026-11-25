import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "../_lib/auth-actions";
import { displayName, getProfile, getUser, isAdmin } from "../_lib/supabase";
import Logo from "./logo";
import NavLinks, { MobileMenu } from "./nav-links";

async function Account() {
  const user = await getUser();
  if (!user)
    return (
      <>
        <Link href="/login" className="hover:text-white">로그인</Link>
        <Link href="/signup" className="rounded-full border border-amber px-4 py-1.5 text-champagne hover:bg-amber hover:text-mocha-night">
          회원가입
        </Link>
      </>
    );
  const profile = await getProfile();
  const name = profile?.name ?? displayName(user);
  return (
    <>
      <Link href="/profile" className="flex items-center gap-2 hover:text-white" aria-label={`${name}님 내 정보`}>
        <span className="relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-mocha-night font-serif text-xs ring-1 ring-champagne/30">
          {profile?.avatar_url ? <Image src={profile.avatar_url} alt="" fill sizes="28px" className="object-cover" /> : name.slice(0, 1)}
        </span>
        <span className="max-w-32 truncate">{name}님</span>
      </Link>
      {isAdmin(user) && (
        <Link href="/admin" className="rounded-full bg-amber px-3 py-1 text-xs font-medium text-mocha-night hover:bg-champagne">
          관리자
        </Link>
      )}
      <form action={signOut}>
        <button className="underline-offset-4 hover:underline">로그아웃</button>
      </form>
    </>
  );
}

export default function Header() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--nav-h)] items-center justify-between gap-6 bg-mocha-deep/75 px-[var(--gutter)] text-champagne backdrop-blur-md">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo className="size-7" />
          <span className="font-serif text-[1.15rem] font-semibold tracking-[0.04em]">대구신현교회</span>
        </Link>
        <NavLinks
          className="hidden gap-[clamp(1rem,2.2vw,2.25rem)] text-[0.95rem] lg:flex"
          itemClassName="relative py-2 text-champagne/80 transition-colors hover:text-champagne aria-[current=page]:text-champagne after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-amber after:transition-transform aria-[current=page]:after:scale-x-100"
        />
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden items-center gap-4 sm:flex">
            <Suspense fallback={<span className="w-24" />}>
              <Account />
            </Suspense>
          </div>
          <button popoverTarget="site-menu" className="flex items-center gap-2 lg:hidden" aria-label="메뉴 열기">
            <span aria-hidden className="flex w-6 flex-col gap-1.5">
              <i className="h-px bg-champagne" />
              <i className="h-px w-4 bg-champagne" />
            </span>
            메뉴
          </button>
        </div>
      </header>
      <MobileMenu>
        <Suspense>
          <Account />
        </Suspense>
      </MobileMenu>
    </>
  );
}
