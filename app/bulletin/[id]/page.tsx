import { BoardDetail } from "../../_components/board";
import { postMetadata } from "../../_lib/seo";

export function generateMetadata({ params }: PageProps<"/bulletin/[id]">) {
  return postMetadata("bulletin", params);
}

export default function Page({ params }: PageProps<"/bulletin/[id]">) {
  return <BoardDetail board="bulletin" params={params} />;
}
