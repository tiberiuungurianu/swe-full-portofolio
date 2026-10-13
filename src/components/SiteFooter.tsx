import Link from "next/link";

import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">{profile.nameLockup}</p>
        <p className="site-footer__note">
          Software engineering portfolio — separate from tiberiu.online.
        </p>
        <ul className="site-footer__links">
          {profile.social.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/guestbook">guestbook</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
