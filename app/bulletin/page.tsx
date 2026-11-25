import { pageMeta } from "../_lib/seo";
import { BoardIndex } from "../_components/board";

export const metadata = pageMeta("교회 주보", "대구신현교회 주일 예배 순서와 교회 광고를 담은 주보입니다.", "/bulletin");

export default function Page({ searchParams }: PageProps<"/bulletin">) {
  return <BoardIndex board="bulletin" searchParams={searchParams} />;
}
