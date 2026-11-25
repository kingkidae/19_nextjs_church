import { pageMeta } from "../_lib/seo";
import Image from "next/image";
import VideoPlayer from "../_components/video-player";
import { getContent } from "../_lib/content";

export const metadata = pageMeta("온라인 예배", "대구신현교회 주일예배, 수요예배, 금요예배, 새벽기도회 영상을 온라인으로 함께 드립니다.", "/online");

export default async function Page() {
  const { videos } = await getContent();
  return (
    <main className="screen flex flex-col bg-mocha-night">
      <Image src="/images/candles.jpg" alt="" fill priority sizes="100vw" className="tone object-cover opacity-25" />
      <h1 className="relative mb-[2.5svh] font-serif text-[clamp(1.9rem,6svh,3.8rem)] leading-tight">온라인 예배</h1>
      <div className="relative min-h-0 flex-1">
        <VideoPlayer videos={videos} />
      </div>
    </main>
  );
}
