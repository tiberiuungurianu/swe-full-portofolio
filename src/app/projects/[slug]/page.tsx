import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectNotes } from "@/components/ProjectNotes";
import { projects, getProject } from "@/content/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "project not found" };
  }
  return {
    title: project.title.toLowerCase(),
    description: project.shortSummary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="page">
      <article className="section">
        <p className="eyebrow">
          <Link href="/projects">projects</Link> / {project.slug}
        </p>
        <h1 className="section-heading">{project.title}</h1>
        <p className="lede">{project.shortSummary}</p>

        <dl className="detail-list">
          <div>
            <dt>Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>Engineering approach</dt>
            <dd>{project.approach}</dd>
          </div>
          <div>
            <dt>Technologies</dt>
            <dd>
              <ul className="chip-list">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Verified results</dt>
            <dd>{project.results}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
        </dl>

        {project.sections ? <ProjectNotes sections={project.sections} /> : null}

        <div className="inline-actions">
          <Link className="button button--primary" href="/projects">
            back to projects
          </Link>
          {project.links.map((link) => (
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
