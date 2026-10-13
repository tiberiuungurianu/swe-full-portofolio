import type { Metadata } from "next";
import Link from "next/link";

import { education, experience } from "@/content/experience";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "about",
  description:
    "About Tiberiu Ungurianu — software engineering, cybersecurity, identity work, research and education.",
};

export default function AboutPage() {
  return (
    <div className="page about-stack">
      <section className="section" aria-labelledby="about-heading">
        <h1 className="section-heading" id="about-heading">
          about
        </h1>
        {profile.bio.map((paragraph) => (
          <p className="section-intro" key={paragraph}>
            {paragraph}
          </p>
        ))}
        <p className="section-intro">{profile.focus}</p>
      </section>

      <section className="section" aria-labelledby="experience-heading">
        <h2 className="section-heading" id="experience-heading">
          experience
        </h2>
        <ol className="timeline">
          {experience.map((item) => (
            <li key={item.id}>
              <h3>
                {item.role} · {item.organisation}
              </h3>
              <p className="meta">{item.period}</p>
              <p>{item.summary}</p>
              {item.highlights ? (
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <h2 className="section-heading" id="skills-heading">
          skills
        </h2>
        <p className="section-intro">
          Skills listed with the kinds of work that evidence them — not as
          percentage bars.
        </p>
        <div className="skill-groups">
          <div>
            <h3>languages</h3>
            <ul className="chip-list">
              {profile.skills.languages.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p className="privacy-note">
              Used across application services, data work and academic systems
              projects.
            </p>
          </div>
          <div>
            <h3>frameworks</h3>
            <ul className="chip-list">
              {profile.skills.frameworks.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p className="privacy-note">
              Evidenced in React front ends, Spring Boot / FastAPI services and
              the ASP.NET MVC password manager coursework.
            </p>
          </div>
          <div>
            <h3>platforms</h3>
            <ul className="chip-list">
              {profile.skills.platforms.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>domains</h3>
            <ul className="chip-list">
              {profile.skills.domains.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p className="privacy-note">
              Connected to Graduate Developer work at Third Wave Identity and
              ethical hacking clinic practice.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="research-heading">
        <h2 className="section-heading" id="research-heading">
          research and education
        </h2>
        <div className="panel">
          <h3>{profile.publication.title}</h3>
          <p>{profile.publication.authors}</p>
          <p>{profile.publication.venue}</p>
          <p>
            DOI:{" "}
            <a
              href={profile.publication.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.publication.doi}
            </a>
          </p>
        </div>
        <ol className="timeline">
          {education.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p className="meta">
                {item.organisation} · {item.period}
              </p>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="contact-heading">
        <h2 className="section-heading" id="contact-heading">
          contact
        </h2>
        <p className="section-intro">
          Working links only. Missing destinations are listed honestly rather
          than invented.
        </p>
        <ul className="chip-list">
          {profile.contact.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="callout">
          <p>
            <strong>Not linked yet:</strong> {profile.missing.email}{" "}
            {profile.missing.cv}
          </p>
          <p>
            Prefer a short public note?{" "}
            <Link href="/guestbook">Leave a message in the guestbook</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
