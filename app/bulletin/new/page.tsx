import { noIndex } from "../../_lib/seo";
import { BoardEditor } from "../../_components/board";

export const metadata = noIndex("교회 주보 글쓰기");

export default function Page() {
  return <BoardEditor board="bulletin" />;
}
