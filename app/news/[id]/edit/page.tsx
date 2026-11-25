import { noIndex } from "../../../_lib/seo";
import { BoardEditor } from "../../../_components/board";

export const metadata = noIndex("교회 소식 수정");

export default function Page({ params }: PageProps<"/news/[id]/edit">) {
  return <BoardEditor board="news" params={params} />;
}
