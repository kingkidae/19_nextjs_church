import { getContent } from "../_lib/content";
import Link from "next/link";
import Logo from "./logo";

export default async function Location({ footer = true }: { footer?: boolean }) {
  const { church } = await getContent();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[clamp(1.25rem,4vw,4rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <h2 className="font-serif text-[clamp(1.9rem,6svh,3.75rem)] leading-[1.15] text-champagne">오시는 길</h2>
          <p className="mt-[1.6svh] font-serif text-[clamp(1.05rem,2.8svh,1.5rem)] text-champagne">{church.address}</p>
          <dl className="mt-[3svh] grid gap-[1.8svh] text-[clamp(0.8rem,1.85svh,0.95rem)] leading-relaxed">
            <div>
              <dt className="text-amber">찾아오시는 길</dt>
              <dd className="text-champagne/80">{church.directions}</dd>
            </div>
            <div>
              <dt className="text-amber">주차 안내</dt>
              <dd className="max-w-[46ch] text-champagne/80">{church.parking}</dd>
            </div>
            <div>
              <dt className="text-amber">전화</dt>
              <dd>
                <a href={`tel:${church.phone}`} className="text-champagne/80 hover:text-champagne">{church.phone}</a>
              </dd>
            </div>
          </dl>
          <div className="mt-[3.2svh] flex flex-wrap gap-3 text-sm">
            <a href={church.naverDirections} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber px-5 py-2.5 font-medium text-mocha-night transition-colors hover:bg-champagne">
              네이버 지도로 길찾기
            </a>
            <a href={church.naverPlace} target="_blank" rel="noopener noreferrer" className="rounded-full border border-champagne/40 px-5 py-2.5 text-champagne transition-colors hover:border-champagne">
              지도에서 보기
            </a>
          </div>
        </div>
        <div className="map-frame relative max-h-[34svh] min-h-24 flex-1 overflow-hidden rounded-[clamp(10px,1.4vw,18px)] lg:h-[min(60svh,34rem)] lg:max-h-none lg:flex-none">
          <iframe src={church.mapEmbed} title="대구신현교회 위치 지도" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0" />
        </div>
      </div>
      {footer && (
        <footer className="mt-[2.5svh] flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-champagne/15 pt-[2svh] text-[0.78rem] text-champagne/55">
          <span className="flex items-center gap-2">
            <Logo className="size-5" /> {church.name}, {church.denomination}
          </span>
          <span className="flex gap-4">
            <Link href="/terms" className="hover:text-champagne">이용약관</Link>
            <Link href="/privacy" className="font-medium text-champagne/80 hover:text-champagne">개인정보 처리방침</Link>
            <span>© {church.name}</span>
          </span>
        </footer>
      )}
    </div>
  );
}
