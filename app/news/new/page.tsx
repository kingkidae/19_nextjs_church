import { noIndex } from "../../_lib/seo";
import { BoardEditor } from "../../_components/board";

export const metadata = noIndex("교회 소식 글쓰기");

export default function Page() {
  return <BoardEditor board="news" />;
}
