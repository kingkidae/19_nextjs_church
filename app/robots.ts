import type { MetadataRoute } from "next";
import { SITE_URL } from "./_lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/profile", "/auth/", "/login", "/signup", "/news/new", "/bulletin/new"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
