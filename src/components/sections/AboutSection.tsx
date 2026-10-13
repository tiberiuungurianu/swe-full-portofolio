import { profile } from "@/content/profile";

/** About copy. The aside is the smaller, quieter line. */
export function AboutSection() {
  return (
    <section className="section" aria-labelledby="about-heading">
      <h2 className="section-heading" id="about-heading">
        about me
      </h2>
      {profile.bio.map((bioParagraph) => (
        <p className="section-intro" key={bioParagraph}>
          {bioParagraph}
        </p>
      ))}
      <p className="about-aside">{profile.bioAside}</p>
      <p className="section-intro">{profile.research}</p>
    </section>
  );
}
