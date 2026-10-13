import { experience } from "@/content/experience";

/** Job timeline. Each entry is one role from `src/content/experience.ts`. */
export function ExperienceSection() {
  return (
    <section className="section" aria-labelledby="experience-heading">
      <h2 className="section-heading" id="experience-heading">
        experience
      </h2>
      <ol className="timeline">
        {experience.map((experienceEntry) => (
          <li key={experienceEntry.id}>
            <h3>
              {experienceEntry.role} · {experienceEntry.organisation}
            </h3>
            <p className="meta">{experienceEntry.period}</p>
            <p>{experienceEntry.summary}</p>
            {experienceEntry.highlights ? (
              <ul>
                {experienceEntry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
