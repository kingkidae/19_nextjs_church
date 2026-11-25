import { BoardDetail } from "../../_components/board";
import { postMetadata } from "../../_lib/seo";

export function generateMetadata({ params }: PageProps<"/news/[id]">) {
  return postMetadata("news", params);
}

export default function Page({ params }: PageProps<"/news/[id]">) {
  return <BoardDetail board="news" params={params} />;
}
