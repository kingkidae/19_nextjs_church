import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { defaults, type Content } from "./church";

export const CONTENT_TAG = "content";
export const POSTS_TAG = "posts";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://daegu-sinhyun-church.vercel.app";

const publicClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
};

// Post URLs for sitemap.xml
export async function getPostLinks() {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("posts").select("id, board, updated_at").order("id", { ascending: false }).limit(5000);
  return data ?? [];
}

// Public site content. Cached and prerendered; admin saves call updateTag(CONTENT_TAG).
export async function getContent(): Promise<Content> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours"); // also picks up edits made directly in the Supabase dashboard

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return defaults;

  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const [s, w, v] = await Promise.all([
    sb.from("site_settings").select("key, value"),
    sb.from("worship_times").select("id, grp, name, ampm, time, sort").order("sort").order("id"),
    sb.from("videos").select("id, youtube_id, title, grp, sort").order("sort").order("id"),
  ]);
  if (s.error || w.error || v.error) {
    console.error("content load failed, using defaults", s.error ?? w.error ?? v.error);
    return defaults;
  }
  const settings = Object.fromEntries(s.data.map((r) => [r.key, r.value]));
  return {
    church: { ...defaults.church, ...settings.church },
    theme: { ...defaults.theme, ...settings.theme },
    about: { ...defaults.about, ...settings.about },
    social: { ...defaults.social, ...settings.social },
    worship: w.data,
    videos: v.data,
  };
}

// Title/excerpt for a post's <title>, description and share preview.
export async function getPostMeta(board: string, id: number) {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  const sb = publicClient();
  if (!sb || !Number.isInteger(id)) return null;
  const { data } = await sb.from("posts").select("title, content, created_at").eq("board", board).eq("id", id).maybeSingle();
  return data;
}
