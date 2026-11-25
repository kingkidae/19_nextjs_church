import { WORSHIP_GROUPS } from "../_lib/church";
import { getContent } from "../_lib/content";

// Styled after a wooden hymn-number board: each time sits in an inset slot.
export default async function WorshipBoard() {
  const { worship } = await getContent();
  return (
    <div className="hymn-board grid w-full gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-[1.6svh] rounded-[clamp(10px,1.4vw,18px)] p-[clamp(0.9rem,2.6svh,2.75rem)] md:grid-cols-3 md:gap-y-[2.4svh]">
      {WORSHIP_GROUPS.map((group) => (
        <section key={group}>
          <h3 className="mb-[1svh] border-b border-champagne/25 pb-[0.8svh] font-serif text-[clamp(1rem,2.6svh,1.45rem)] text-champagne md:mb-[1.4svh]">
            {group}
          </h3>
          <dl className="space-y-[0.45svh] md:space-y-[0.9svh]">
            {worship
              .filter((r) => r.grp === group)
              .map((r) => (
                <div key={r.id ?? r.name} className="flex items-center justify-between gap-3">
                  <dt className="text-[clamp(0.8rem,1.9svh,1rem)] text-champagne/80">{r.name}</dt>
                  <dd className="hymn-slot flex items-baseline gap-1.5 rounded-[4px] px-[0.7em] py-[0.1em] font-serif text-champagne md:py-[0.25em]">
                    <span className="text-[clamp(0.62rem,1.4svh,0.75rem)] text-champagne/60">{r.ampm}</span>
                    <span className="tabular-nums text-[clamp(1rem,2.5svh,1.4rem)]">{r.time}</span>
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
