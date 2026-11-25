import { noIndex } from "../../../_lib/seo";
import { BoardEditor } from "../../../_components/board";

export const metadata = noIndex("교회 주보 수정");

export default function Page({ params }: PageProps<"/bulletin/[id]/edit">) {
  return <BoardEditor board="bulletin" params={params} />;
}
