import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseReady = Boolean(url && key);

export async function createClient() {
  if (!url || !key) throw new Error("Supabase 환경변수(.env.local)가 설정되지 않았습니다.");
  const store = await cookies();
  // supabase-js reads Date.now() on creation, which Next rejects while prerendering; keep it request-time
  await connection();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        // Server Components can't set cookies; proxy.ts refreshes the session instead
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {}
      },
    },
  });
}

// cache(): header and page share one auth lookup per request
export const getUser = cache(async () => {
  if (!supabaseReady) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export type Profile = {
  id: string;
  name: string;
  phone: string | null;
  birthday: string | null;
  address: string | null;
  avatar_url: string | null;
};

export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<Profile>();
  return data;
});

// First login = no profile row yet: send them to fill it in, then on to where they were going.
export async function afterLogin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, next: string) {
  const { data } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  return data ? next : `/profile?welcome=1&next=${encodeURIComponent(next)}`;
}

export type Post = {
  id: number;
  board: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });

export function displayName(user: { email?: string; user_metadata?: Record<string, unknown> }) {
  const m = user.user_metadata ?? {};
  return String(m.name ?? m.full_name ?? user.email?.split("@")[0] ?? "성도");
}

export function isAdmin(user: { app_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role === "admin";
}
