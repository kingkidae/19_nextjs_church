import type { Metadata } from "next";
import { boards } from "./church";
import { getPostMeta } from "./content";

// Per-page metadata: title, description, canonical URL and matching Open Graph / Twitter tags.
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | 대구신현교회`, description, url: path, type: "website", locale: "ko_KR", siteName: "대구신현교회", images: ["/og.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | 대구신현교회`, description, images: ["/og.jpg"] },
  };
}

// Pages that should never show up in search results.
export const noIndex = (title: string): Metadata => ({ title, robots: { index: false, follow: false } });

export async function postMetadata(board: "news" | "bulletin", params: Promise<{ id: string }>): Promise<Metadata> {
  const id = Number((await params).id);
  const post = await getPostMeta(board, id);
  if (!post) return { title: boards[board].label };
  const description = post.content.replace(/\s+/g, " ").slice(0, 140);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/${board}/${id}` },
    openGraph: { type: "article", title: post.title, description, url: `/${board}/${id}`, publishedTime: post.created_at, siteName: "대구신현교회", locale: "ko_KR", images: ["/og.jpg"] },
  };
}
