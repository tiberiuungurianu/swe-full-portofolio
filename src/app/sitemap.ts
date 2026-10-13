import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const staticRoutes = ["", "/projects", "/guestbook"].map((path) => ({
    url: `${origin}${path || "/"}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${origin}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
