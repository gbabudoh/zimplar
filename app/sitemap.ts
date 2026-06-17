import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.zimplar.com";

  // Public application routes
  const routes = [
    "",
    "/about",
    "/courses",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/courses" || route === "/about" ? 0.8 : 0.5,
  }));
}
