import { ProjectExplorer } from "@/components/ProjectExplorer";
import { projects } from "@/content/projects";

type ProjectsSectionProps = {
  /** Slug from the URL. Passed through so the explorer can open that project. */
  initialSlug?: string;
};

/**
 * Projects page heading plus the explorer.
 * `key` remounts the explorer when the URL slug changes, so the selection resets.
 */
export function ProjectsSection({ initialSlug }: ProjectsSectionProps) {
  return (
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
  );
}
