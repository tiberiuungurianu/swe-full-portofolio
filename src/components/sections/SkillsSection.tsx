import { profile } from "@/content/profile";

/** Skill chips grouped by language, framework, platform, and domain. */
export function SkillsSection() {
  return (
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
            {profile.skills.languages.map((languageName) => (
              <li key={languageName}>{languageName}</li>
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
            {profile.skills.frameworks.map((frameworkName) => (
              <li key={frameworkName}>{frameworkName}</li>
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
            {profile.skills.platforms.map((platformName) => (
              <li key={platformName}>{platformName}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>domains</h3>
          <ul className="chip-list">
            {profile.skills.domains.map((domainName) => (
              <li key={domainName}>{domainName}</li>
            ))}
          </ul>
          <p className="privacy-note">
            Connected to academic cybersecurity practice, including the ethical
            hacking clinic.
          </p>
        </div>
      </div>
    </section>
  );
}
