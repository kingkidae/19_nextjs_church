import { noIndex } from "../_lib/seo";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AvatarForm, ProfileForm } from "../_components/profile-forms";
import { safeNext } from "../_lib/safe-next";
import { displayName, getProfile, getUser } from "../_lib/supabase";

export const metadata = noIndex("내 정보");

async function Body({ searchParams }: { searchParams: PageProps<"/profile">["searchParams"] }) {
  const [user, profile, sp] = await Promise.all([getUser(), getProfile(), searchParams]);
  if (!user) redirect("/login?next=/profile");
  const welcome = sp.welcome === "1";
  const name = profile?.name ?? displayName(user);

  return (
    <div className="grid h-full min-h-0 content-center gap-[clamp(1.5rem,4svh,3rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-[6vw]">
      <div className="flex flex-col items-center gap-[2.5svh] lg:items-start">
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-[clamp(1.7rem,5.4svh,3.4rem)] leading-tight">{welcome ? `${name}님, 환영합니다` : "내 정보"}</h1>
          <p className="mt-[1svh] max-w-[34ch] text-[clamp(0.85rem,1.9svh,1rem)] leading-relaxed text-champagne/75">
            {welcome ? "교회가 성도님을 알고 연락드릴 수 있도록 정보를 남겨 주세요. 이름 말고는 비워 두셔도 됩니다." : "입력한 정보는 본인만 볼 수 있습니다."}
          </p>
        </div>
        <AvatarForm url={profile?.avatar_url ?? null} name={name} />
      </div>
      <div className="w-full max-w-[34rem] justify-self-center lg:justify-self-start">
        <ProfileForm profile={profile} fallbackName={displayName(user)} email={user.email ?? ""} welcome={welcome} next={safeNext(sp.next)} />
      </div>
    </div>
  );
}

export default function Page({ searchParams }: PageProps<"/profile">) {
  return (
    <main className="screen overflow-y-auto bg-[radial-gradient(ellipse_at_20%_30%,#584632,#3d3023_70%)]">
      <Suspense fallback={<p className="py-20 text-center text-sm text-champagne/60">불러오는 중…</p>}>
        <Body searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
