import Link from "next/link";

import { DecorativeMotif } from "@/components/DecorativeMotif";
import { education, experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";

export default function HomePage() {
  const featured = getFeaturedProjects().slice(0, 4);
  const latestRoles = experience.slice(0, 2);

  return (
    <div className="page">
      <section className="hero" aria-labelledby="intro-heading">
        <p className="eyebrow">software engineer · london</p>
        <h1 id="intro-heading">{profile.shortIntro}</h1>
        <DecorativeMotif />
        <p className="lede">{profile.positioning}</p>
        <div className="inline-actions">
          <Link className="button button--primary" href="/projects">
            explore my projects
          </Link>
          <Link className="button button--ghost" href="/guestbook">
            get in touch
          </Link>
        </div>
        <ul className="chip-list" aria-label="Profiles">
          {profile.social.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="selected-projects">
        <h2 className="section-heading" id="selected-projects">
          selected projects
        </h2>
        <p className="section-intro">
          A short tour of engineering work across research, product MVPs and
          secure application development.
        </p>
        <div className="home-projects">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="home-project"
            >
              <strong>{project.title}</strong>
              <span>{project.shortSummary}</span>
            </Link>
          ))}
        </div>
        <div className="inline-actions">
          <Link className="button button--ghost" href="/projects">
            view all projects
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="experience-research">
        <h2 className="section-heading" id="experience-research">
          experience and research
        </h2>
        <div className="summary-grid">
          <div className="summary-block">
            <h3>professional</h3>
            <ul>
              {latestRoles.map((item) => (
                <li key={item.id}>
                  <strong>
                    {item.role}, {item.organisation}
                  </strong>
                  {" — "}
                  {item.period}. {item.summary}
                </li>
              ))}
            </ul>
          </div>
          <div className="summary-block">
            <h3>research and study</h3>
            <p>
              First-author IEEE publication:{" "}
              <a
                href={profile.publication.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.publication.title}
              </a>
              .
            </p>
            <ul>
              {education.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> — {item.organisation} (
                  {item.period}).
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="inline-actions">
          <Link className="button button--ghost" href="/about">
            read about me
          </Link>
          <Link className="button button--ghost" href="/guestbook">
            contact me
          </Link>
        </div>
      </section>
    </div>
  );
}
