import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/about", "/guestbook"].map(
    (path) => ({
      url: `https://example.invalid${path || "/"}`,
      lastModified: new Date(),
    }),
  );

  const projectRoutes = projects.map((project) => ({
    url: `https://example.invalid/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  // example.invalid is a placeholder host until a production domain is chosen.
  return [...staticRoutes, ...projectRoutes];
}
