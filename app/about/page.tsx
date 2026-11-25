import { pageMeta } from "../_lib/seo";
import Image from "next/image";
import { getContent } from "../_lib/content";

export const metadata = pageMeta("교회 소개", "1971년에 세워진 대한예수교장로회 합동 동대구노회 소속 대구신현교회의 비전과 역사. 하나님 중심, 성경 중심, 교회 중심의 건강한 교회를 꿈꿉니다.", "/about");

const SPOTS = [
  { x: 50, y: 12 },
  { x: 14, y: 82 },
  { x: 86, y: 82 },
];

export default async function Page() {
  const { church, theme, about } = await getContent();
  const centers = about.centers.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3).map((label, i) => ({ label, ...SPOTS[i] }));
  return (
    <main>
      <section className="screen flex items-end">
        <Image src="/images/rays.jpg" alt="" fill priority sizes="100vw" className="tone -z-10 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-mocha-night via-mocha-night/30 to-transparent" />
        <div className="max-w-[30ch] pb-[6svh]">
          <h1 className="text-[0.95rem] text-amber">교회 소개</h1>
          <p className="mt-[2svh] font-serif text-[clamp(1.8rem,6.4svh,4.2rem)] leading-[1.35]">
            {about.vision}
          </p>
        </div>
      </section>

      <section className="screen bg-champagne text-mocha-deep">
        <div className="grid h-full min-h-0 items-center gap-[clamp(1.5rem,5vw,5rem)] lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[clamp(1.75rem,5.6svh,3.6rem)]">건강한 교회</h2>
            <p className="mt-[2svh] max-w-[38ch] text-[clamp(0.9rem,2.1svh,1.1rem)] leading-[1.85] text-mocha">
              {about.healthy}
            </p>
          </div>
          {/* the three centers hold each other up: drawn as a triangle */}
          <div className="relative mx-auto aspect-[1.15] w-[86%] max-w-[min(100%,60svh)] lg:w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
              <polygon points="50,12 14,82 86,82" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth=".3" vectorEffect="non-scaling-stroke" />
            </svg>
            {centers.map((c) => (
              <div key={c.label} className="absolute grid size-[clamp(5.25rem,min(20svh,26vw),10rem)] -translate-x-1/2 -translate-y-1/2 place-items-center whitespace-nowrap rounded-full border border-mocha/40 bg-champagne font-serif text-[clamp(0.85rem,min(2.4svh,3.6vw),1.3rem)]" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                <span className="relative">
                  {c.label}
                  <i className="absolute -top-3 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-amber" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="screen">
        <div className="grid h-full min-h-0 items-center gap-[clamp(1.5rem,5vw,5rem)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <div className="arch relative mx-auto aspect-[1/1.12] h-[min(34svh,100%)] overflow-hidden md:h-[min(64svh,100%)]">
            <Image src="/images/prayer-kids.jpg" alt="두 손 모아 기도하는 아이" fill sizes="40vw" className="tone object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-[clamp(1.75rem,5.6svh,3.6rem)]">성령과 말씀</h2>
            <p className="mt-[2.4svh] max-w-[36ch] font-serif text-[clamp(1.05rem,2.8svh,1.5rem)] leading-[1.8]">
              {church.name}는 {church.denomination} 소속입니다.
            </p>
            <p className="mt-[2svh] max-w-[40ch] text-[clamp(0.9rem,2.1svh,1.1rem)] leading-[1.85] text-champagne/80">
              {about.spirit}
            </p>
          </div>
        </div>
      </section>

      <section className="screen bg-mocha-night">
        {/* shown at its own size in an arch: the source is only 1030px wide, too small for a full-screen background */}
        <div className="arch absolute right-[var(--gutter)] top-1/2 hidden aspect-[1/1.12] h-[min(54svh,30rem)] -translate-y-[56%] overflow-hidden md:block">
          <Image src="/images/sermon.jpg" alt="강단에서 설교하는 모습" fill sizes="32rem" className="tone object-cover" />
        </div>
        <div className="relative flex h-full flex-col justify-between">
          <h2 className="font-serif text-[clamp(1.75rem,5.6svh,3.6rem)]">역사와 전통</h2>
          <p aria-hidden className="font-serif text-[clamp(6rem,30svh,22rem)] leading-none tracking-[-0.02em] text-champagne/90">
            {church.founded}
          </p>
          <div className="grid gap-[2svh] md:grid-cols-2 md:gap-[5vw]">
            <p className="max-w-[40ch] text-[clamp(0.9rem,2.1svh,1.1rem)] leading-[1.85] text-champagne/85">
              {church.name}는 {church.founded}년에 세워진 전통 있는 교회입니다. {about.history}
            </p>
            <p className="font-serif text-[clamp(1rem,2.6svh,1.4rem)] leading-relaxed">
              {theme.title}
              <span className="block text-[0.8em] text-amber">{theme.sub}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
