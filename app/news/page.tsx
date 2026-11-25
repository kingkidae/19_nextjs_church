import { pageMeta } from "../_lib/seo";
import { BoardIndex } from "../_components/board";

export const metadata = pageMeta("교회 소식", "대구신현교회의 일정과 행사, 성도들의 소식을 전합니다.", "/news");

export default function Page({ searchParams }: PageProps<"/news">) {
  return <BoardIndex board="news" searchParams={searchParams} />;
}
