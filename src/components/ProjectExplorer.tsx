"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";

import type { Project } from "@/content/projects";

type ProjectExplorerProps = {
  /** Project records from `src/content/projects.ts`. */
  projects: Project[];
  /**
   * Slug from the URL (`/projects/pennypilot`).
   * When it is missing or unknown, the first project opens instead.
   */
  initialSlug?: string;
};

/**
 * Picks the project shown on the first render.
 * A slug is the short URL id, not the visible title.
 */
function resolveInitialProjectSlug(projects: Project[], initialSlug?: string) {
  const slugExistsInList = projects.some((project) => project.slug === initialSlug);
  if (initialSlug && slugExistsInList) {
    return initialSlug;
  }
  return projects[0]?.slug;
}

/**
 * Projects page explorer.
 * Left column: one tab button per project. Right column: the selected project's details.
 * Click, arrow keys, and touch all change the selection. Hover is not required.
 */
export function ProjectExplorer({
  projects,
  initialSlug,
}: ProjectExplorerProps) {
  // Unique prefix so each tab id points at the detail panel for screen readers.
  const tabIdPrefix = useId();
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(() =>
    resolveInitialProjectSlug(projects, initialSlug),
  );

  const selectedProject =
    projects.find((project) => project.slug === selectedProjectSlug) ??
    projects[0];

  /** Moves to a neighbour. +1 is next, -1 is previous. The list wraps at both ends. */
  const selectAdjacentProject = useCallback(
    (step: number) => {
      if (!selectedProject) return;
      const selectedIndex = projects.findIndex(
        (project) => project.slug === selectedProject.slug,
      );
      const wrappedIndex =
        (selectedIndex + step + projects.length) % projects.length;
      setSelectedProjectSlug(projects[wrappedIndex].slug);
    },
    [projects, selectedProject],
  );

  if (!selectedProject) {
    return <p>No projects to show yet.</p>;
  }

  return (
    <div className="project-explorer">
      <div className="project-explorer__list" role="tablist" aria-label="Projects">
        {projects.map((project) => {
          const isActiveTab = project.slug === selectedProject.slug;
          return (
            <button
              key={project.slug}
              type="button"
              role="tab"
              id={`${tabIdPrefix}-${project.slug}`}
              aria-selected={isActiveTab}
              aria-controls={`${tabIdPrefix}-panel`}
              className={
                isActiveTab
                  ? "project-explorer__tab is-active"
                  : "project-explorer__tab"
              }
              onClick={() => setSelectedProjectSlug(project.slug)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  selectAdjacentProject(1);
                }
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectAdjacentProject(-1);
                }
              }}
            >
              <span className="project-explorer__tab-title">{project.title}</span>
              <span className="project-explorer__tab-summary">
                {project.shortSummary}
              </span>
            </button>
          );
        })}
      </div>

      <article
        className="project-explorer__panel"
        role="tabpanel"
        id={`${tabIdPrefix}-panel`}
        aria-labelledby={`${tabIdPrefix}-${selectedProject.slug}`}
      >
        <p className="eyebrow">selected project</p>
        <h2>{selectedProject.title}</h2>
        <p className="lede">{selectedProject.shortSummary}</p>

        {/* No screenshot yet: show the honest note instead of a made-up image. */}
        <div className="project-preview" aria-hidden={false}>
          {selectedProject.hasScreenshot ? null : (
            <div className="project-preview__neutral">
              <span>{selectedProject.previewNote}</span>
            </div>
          )}
        </div>

        <dl className="detail-list">
          <div>
            <dt>Role</dt>
            <dd>{selectedProject.role}</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>{selectedProject.problem}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>{selectedProject.approach}</dd>
          </div>
          <div>
            <dt>Technologies</dt>
            <dd>
              <ul className="chip-list">
                {selectedProject.technologies.map((technologyName) => (
                  <li key={technologyName}>{technologyName}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Results / status</dt>
            <dd>
              {selectedProject.results} {selectedProject.status}
            </dd>
          </div>
        </dl>

        <div className="inline-actions">
          <Link
            className="button button--primary"
            href={`/projects/${selectedProject.slug}`}
          >
            open project page
          </Link>
          {selectedProject.links.map((externalLink) => (
            <a
              key={externalLink.href}
              className="button button--ghost"
              href={externalLink.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {externalLink.label}
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}
