import Link from "next/link";

export type Section = { title: string; body: React.ReactNode };

// Shared layout for /terms and /privacy: one screen, the document scrolls inside it.
export default function LegalDoc({ title, effective, intro, sections }: { title: string; effective: string; intro: React.ReactNode; sections: Section[] }) {
  return (
    <main className="screen bg-champagne text-mocha-deep">
      <div className="grid h-full min-h-0 gap-[clamp(1rem,4vw,4rem)] lg:grid-cols-[minmax(0,15rem)_minmax(0,46rem)]">
        <header>
          <h1 className="font-serif text-[clamp(1.7rem,5svh,3rem)] leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-mocha/70">시행일 {effective}</p>
          <nav aria-label="문서" className="mt-4 hidden gap-3 text-sm lg:grid">
            <Link href="/terms" className="hover:text-amber">이용약관</Link>
            <Link href="/privacy" className="hover:text-amber">개인정보 처리방침</Link>
          </nav>
        </header>
        <article className="min-h-0 overflow-y-auto overscroll-contain pr-2 pb-8 text-[0.95rem] leading-[1.85]">
          <div className="text-mocha">{intro}</div>
          {sections.map((s) => (
            <section key={s.title} className="mt-8">
              <h2 className="mb-2 font-serif text-[1.2rem]">{s.title}</h2>
              <div className="space-y-2 text-mocha [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_td]:border-t [&_td]:border-mocha/20 [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_th]:pb-1 [&_th]:pr-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-normal [&_th]:text-mocha/60">
                {s.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
