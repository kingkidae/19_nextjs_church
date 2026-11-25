import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session cookie on each request.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let response = NextResponse.next({ request });
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list, headers) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();

  // Keep non-admins out of /admin before anything renders (RLS still guards the data itself).
  const path = request.nextUrl.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) {
    const claims = data?.claims;
    const isAdmin = (claims?.app_metadata as { role?: string } | undefined)?.role === "admin";
    if (!isAdmin) {
      const to = new URL(claims ? "/" : `/login?next=${encodeURIComponent(path)}`, request.url);
      const redirect = NextResponse.redirect(to);
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c)); // keep refreshed session cookies
      return redirect;
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|webp|woff2)$).*)"],
};
