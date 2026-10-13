import Link from "next/link";

import { profile } from "@/content/profile";

/** Home headline, two calls to action, and the public profile links. */
export function HomeHero() {
  return (
    <section className="hero" aria-labelledby="intro-heading">
      <p className="eyebrow">software engineer · london</p>
      <h1 id="intro-heading">{profile.shortIntro}</h1>
      <p className="lede">{profile.positioning}</p>
      <div className="inline-actions">
        <Link className="button button--primary" href="/projects">
          see my work
        </Link>
        <Link className="button button--ghost" href="/guestbook">
          get in touch
        </Link>
      </div>
      <ul className="chip-list" aria-label="Profiles">
        {profile.social.map((socialProfile) => (
          <li key={socialProfile.href}>
            <a href={socialProfile.href} target="_blank" rel="noopener noreferrer">
              {socialProfile.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
