"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";

import type { Project } from "@/content/projects";

type ProjectExplorerProps = {
  projects: Project[];
  initialSlug?: string;
};

function resolveInitialSlug(projects: Project[], initialSlug?: string) {
  if (initialSlug && projects.some((project) => project.slug === initialSlug)) {
    return initialSlug;
  }
  return projects[0]?.slug;
}

export function ProjectExplorer({
  projects,
  initialSlug,
}: ProjectExplorerProps) {
  const listId = useId();
  const [selectedSlug, setSelectedSlug] = useState(() =>
    resolveInitialSlug(projects, initialSlug),
  );

  const selected =
    projects.find((project) => project.slug === selectedSlug) ?? projects[0];

  const selectByOffset = useCallback(
    (offset: number) => {
      if (!selected) return;
      const index = projects.findIndex(
        (project) => project.slug === selected.slug,
      );
      const next = projects[(index + offset + projects.length) % projects.length];
      setSelectedSlug(next.slug);
    },
    [projects, selected],
  );

  if (!selected) {
    return <p>No projects to show yet.</p>;
  }

  return (
    <div className="project-explorer">
      <div className="project-explorer__list" role="tablist" aria-label="Projects">
        {projects.map((project) => {
          const selectedItem = project.slug === selected.slug;
          return (
            <button
              key={project.slug}
              type="button"
              role="tab"
              id={`${listId}-${project.slug}`}
              aria-selected={selectedItem}
              aria-controls={`${listId}-panel`}
              className={
                selectedItem
                  ? "project-explorer__tab is-active"
                  : "project-explorer__tab"
              }
              onClick={() => setSelectedSlug(project.slug)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  selectByOffset(1);
                }
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectByOffset(-1);
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
        id={`${listId}-panel`}
        aria-labelledby={`${listId}-${selected.slug}`}
      >
        <p className="eyebrow">selected project</p>
        <h2>{selected.title}</h2>
        <p className="lede">{selected.shortSummary}</p>

        <div className="project-preview" aria-hidden={false}>
          {selected.hasScreenshot ? null : (
            <div className="project-preview__neutral">
              <span>{selected.previewNote}</span>
            </div>
          )}
        </div>

        <dl className="detail-list">
          <div>
            <dt>Role</dt>
            <dd>{selected.role}</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>{selected.problem}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>{selected.approach}</dd>
          </div>
          <div>
            <dt>Technologies</dt>
            <dd>
              <ul className="chip-list">
                {selected.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Results / status</dt>
            <dd>
              {selected.results} {selected.status}
            </dd>
          </div>
        </dl>

        <div className="inline-actions">
          <Link className="button button--primary" href={`/projects/${selected.slug}`}>
            open project page
          </Link>
          {selected.links.map((link) => (
            <a
              key={link.href}
              className="button button--ghost"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}
