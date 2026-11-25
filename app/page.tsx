import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SetupNotice } from "./_components/board";
import HeroScene from "./_components/hero-scene";
import Location from "./_components/location";
import VideoPlayer from "./_components/video-player";
import WorshipBoard from "./_components/worship-board";
import { boards, type Board } from "./_lib/church";
import { getContent } from "./_lib/content";
import { createClient, formatDate, supabaseReady } from "./_lib/supabase";

async function Hero() {
  const { theme } = await getContent();
  let k = 0;
  return (
    <section className="screen !p-0 bg-[radial-gradient(ellipse_at_50%_45%,#584632,#261e16_70%)]">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(38_30_22/0.85),transparent_38%),linear-gradient(to_left,rgb(38_30_22/0.55),transparent_45%)]" />

      <div className="absolute right-[var(--gutter)] top-[calc(var(--nav-h)+5svh)] flex flex-row-reverse items-start gap-[clamp(0.75rem,2.2vw,2rem)]">
        <h1 className="font-serif text-[clamp(2.6rem,min(9.5svh,12vw),7.25rem)] leading-[1.18] tracking-[0.08em] text-champagne [writing-mode:vertical-rl]">
          <span className="sr-only">대구신현교회 {theme.title} 표어: </span>
          {[theme.line1, theme.line2].filter(Boolean).map((line) => (
            <span key={line} className="block">
              {[...line].map((c, i) => (
                <span key={i} className="light-char" style={{ "--i": k++ } as React.CSSProperties}>
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="fade-late mt-[3.5em] hidden font-serif text-[clamp(0.85rem,2.1svh,1.1rem)] leading-[2.1] tracking-[0.18em] text-champagne/70 [writing-mode:vertical-rl] sm:block">
          {theme.rest1}
          <br />
          {theme.rest2}
        </p>
      </div>

      <div className="fade-late absolute bottom-[clamp(1.5rem,7svh,4.5rem)] left-[var(--gutter)]">
        <p className="font-serif text-[clamp(1.6rem,4.6svh,3rem)] text-champagne">{theme.title}</p>
        <p className="mt-1 text-[clamp(0.85rem,1.9svh,1rem)] text-champagne/75">{theme.sub}</p>
        <p className="mt-3 text-[0.8rem] text-amber">{theme.ref}</p>
      </div>
    </section>
  );
}

async function About() {
  const { church, about } = await getContent();
  const pillars = [
    { img: "/images/praise.jpg", title: "건강한 교회", text: about.centers },
    { img: "/images/prayer-kids.jpg", title: "성령과 말씀", text: about.spiritShort },
    { img: "/images/sermon.jpg", title: "역사와 전통", text: `${church.founded}년에 세워진 교회` },
  ];
  return (
    <section className="screen bg-champagne text-mocha-deep">
      <div className="grid h-full min-h-0 content-center gap-[clamp(1.5rem,5svh,4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-center">
        <div>
          <h2 className="whitespace-pre-line font-serif text-[clamp(1.75rem,5.6svh,3.6rem)] leading-[1.25]">{about.homeTitle}</h2>
          <p className="mt-[2.4svh] max-w-[40ch] text-[clamp(0.88rem,2svh,1.05rem)] leading-[1.85] text-mocha">
            {church.name}는 {church.founded}년에 세워진 {church.denomination} 소속 교회입니다. {about.summary}
          </p>
          <Link href="/about" className="mt-[3svh] inline-block border-b border-mocha pb-1 text-sm transition-colors hover:border-amber hover:text-amber">
            교회 소개 자세히 보기
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-[clamp(0.6rem,2vw,2rem)]">
          {pillars.map((p, i) => (
            <li key={p.title} className={i === 1 ? "lg:translate-y-[5svh]" : ""}>
              <div className="arch relative aspect-[1/1.2] max-h-[min(46svh,30rem)] w-full overflow-hidden bg-mocha">
                <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 18vw, 30vw" className="tone object-cover" />
              </div>
              <p className="mt-[1.6svh] font-serif text-[clamp(0.95rem,2.4svh,1.35rem)]">{p.title}</p>
              <p className="mt-1 hidden text-[clamp(0.75rem,1.7svh,0.9rem)] text-mocha/80 sm:block">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Worship() {
  return (
    <section className="screen flex flex-col justify-center">
      <Image src="/images/pews.jpg" alt="" fill sizes="100vw" className="tone -z-10 object-cover opacity-35" />
      <div className="mb-[2svh] flex flex-wrap items-end justify-between gap-x-4 md:mb-[3.5svh]">
        <h2 className="font-serif text-[clamp(1.75rem,5.6svh,3.6rem)] leading-tight">예배 안내</h2>
        <Link href="/worship" className="border-b border-champagne/50 pb-1 text-sm hover:border-amber hover:text-amber">예배 안내 페이지로</Link>
      </div>
      <WorshipBoard />
    </section>
  );
}

async function Online() {
  const { videos } = await getContent();
  return (
    <section className="screen flex flex-col bg-mocha-night">
      <Image src="/images/candles.jpg" alt="" fill sizes="100vw" className="tone object-cover opacity-25" />
      <h2 className="relative mb-[2.5svh] font-serif text-[clamp(1.75rem,5.6svh,3.6rem)] leading-tight">온라인 예배</h2>
      <div className="relative min-h-0 flex-1">
        <VideoPlayer videos={videos} />
      </div>
    </section>
  );
}

async function Latest({ board }: { board: Board }) {
  if (!supabaseReady) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("id, title, created_at").eq("board", board).order("created_at", { ascending: false }).limit(5);
  if (!data?.length) return <p className="py-[4svh] font-serif text-mocha/60">아직 올라온 글이 없습니다.</p>;
  return (
    <ol>
      {data.map((p) => (
        <li key={p.id} className="border-b border-mocha/15">
          <Link href={`/${board}/${p.id}`} className="flex items-baseline justify-between gap-6 py-[clamp(0.55rem,1.8svh,1rem)] transition-colors hover:text-amber">
            <span className="truncate font-serif text-[clamp(0.95rem,2.2svh,1.15rem)]">{p.title}</span>
            <time className="shrink-0 text-[0.78rem] tabular-nums text-mocha/60">{formatDate(p.created_at)}</time>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function News() {
  return (
    <section className="screen flex flex-col justify-center bg-champagne text-mocha-deep">
      <div className="grid gap-[clamp(2rem,6vw,6rem)] md:grid-cols-2">
        {(["news", "bulletin"] as const).map((b) => (
          <div key={b}>
            <div className="mb-[2svh] flex items-end justify-between border-b border-mocha/40 pb-[1.6svh]">
              <h2 className="font-serif text-[clamp(1.5rem,4.6svh,2.8rem)] leading-tight">{boards[b].label}</h2>
              <Link href={`/${b}`} className="text-sm hover:text-amber">전체 보기</Link>
            </div>
            <Suspense fallback={<p className="py-[4svh] text-sm text-mocha/60">불러오는 중…</p>}>
              <Latest board={b} />
            </Suspense>
          </div>
        ))}
      </div>
      {!supabaseReady && (
        <div className="mt-[4svh]">
          <SetupNotice />
        </div>
      )}
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <div aria-hidden className="fixed left-[calc(var(--gutter)/2.5)] top-1/2 z-40 hidden h-[24svh] w-px -translate-y-1/2 bg-champagne/15 md:block">
        <div className="scroll-line h-full w-full bg-amber" />
      </div>
      <Hero />
      <About />
      <Worship />
      <Online />
      <News />
      <section className="screen bg-mocha-deep">
        <Location />
      </section>
    </main>
  );
}
