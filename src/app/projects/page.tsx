import type { Metadata } from "next";

import { ProjectsSection } from "@/components/sections";

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

  return (
    <div className="page">
      <ProjectsSection initialSlug={params?.project} />
    </div>
  );
}
