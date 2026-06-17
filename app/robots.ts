import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.zimplar.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/courses", "/login", "/signup", "/forgot-password", "/reset-password"],
      disallow: ["/admin/", "/dashboard/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
