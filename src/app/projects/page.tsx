import type { Metadata } from "next";

import { ProjectExplorer } from "@/components/ProjectExplorer";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "projects",
  description:
    "Selected software engineering projects by Tiberiu Ungurianu — research, product MVPs and application work.",
};

type ProjectsPageProps = {
  searchParams?: Promise<{ project?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const initialSlug = params?.project;

  return (
    <div className="page">
      <section className="section" aria-labelledby="projects-heading">
        <h1 className="section-heading" id="projects-heading">
          projects
        </h1>
        <p className="section-intro">
          Browse the list, then open a shareable project page. Selection works
          with keyboard, mouse and touch — nothing essential depends on hover.
        </p>
        <ProjectExplorer
          key={initialSlug ?? "default"}
          projects={projects}
          initialSlug={initialSlug}
        />
      </section>
    </div>
  );
}
