import { pageMeta } from "../_lib/seo";
import Image from "next/image";
import WorshipBoard from "../_components/worship-board";

export const metadata = pageMeta("예배 안내", "대구신현교회 예배 시간. 주일 1부 전통예배 오전 10:30, 2부 찬양예배 오후 2:00, 수요예배·금요예배 오후 8:00, 새벽기도회 오전 5:30, 주일학교 안내.", "/worship");

export default function Page() {
  return (
    <main className="screen flex flex-col justify-center">
      <Image src="/images/pews.jpg" alt="" fill priority sizes="100vw" className="tone -z-10 object-cover opacity-40" />
      <div className="mb-[2.5svh] max-w-[46ch] md:mb-[4svh]">
        <h1 className="font-serif text-[clamp(1.9rem,6.5svh,4rem)] leading-tight">예배 안내</h1>
        <p className="mt-[1.6svh] hidden text-[clamp(0.88rem,2svh,1.05rem)] leading-relaxed text-champagne/80 sm:block">
          처음 오신 분도 언제든 환영합니다. 주일 1부는 전통예배로, 2부는 찬양예배로 드립니다.
        </p>
      </div>
      <WorshipBoard />
    </main>
  );
}
