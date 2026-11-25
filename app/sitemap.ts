import type { MetadataRoute } from "next";
import { getPostLinks, SITE_URL } from "./_lib/content";

const PAGES = ["", "/about", "/worship", "/online", "/news", "/bulletin", "/location", "/terms", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostLinks();
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const), priority: p === "" ? 1 : 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/${p.board}/${p.id}`, lastModified: p.updated_at, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
