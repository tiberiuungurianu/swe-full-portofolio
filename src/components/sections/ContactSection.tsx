import Link from "next/link";

import { profile } from "@/content/profile";

/** Working contact links, plus an honest note for destinations that are not public yet. */
export function ContactSection() {
  return (
    <section className="section" aria-labelledby="contact-heading">
      <h2 className="section-heading" id="contact-heading">
        contact
      </h2>
      <p className="section-intro">
        Working links only. Missing destinations are listed honestly rather than
        invented.
      </p>
      <ul className="chip-list">
        {profile.contact.map((contactLink) => (
          <li key={contactLink.href}>
            <a href={contactLink.href} target="_blank" rel="noopener noreferrer">
              {contactLink.label}
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
  );
}
