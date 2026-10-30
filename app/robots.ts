import type { MetadataRoute } from "next";

const SITE = process.env.SITE_URL ?? "https://infosystems.mn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/portal", "/api"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
