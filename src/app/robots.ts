import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://gta6.xdeals.online";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
