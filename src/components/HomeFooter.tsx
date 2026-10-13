"use client";

import Link from "next/link";

import { SpinningCdMotion } from "@/components/SpinningCdMotion";
import { profile } from "@/content/profile";

/** Home-only footer. Copy sits bottom-left, the disc bottom-centre, pause bottom-right. */
export function HomeFooter() {
  return (
    <footer className="site-footer site-footer--home">
      <div className="site-footer__inner">
        <div className="site-footer__meta">
          <p className="site-footer__brand">{profile.nameLockup}</p>
          <p className="site-footer__note">Software engineering portfolio</p>
          <ul className="site-footer__links">
            {profile.social.map((socialProfile) => (
              <li key={socialProfile.href}>
                <a
                  href={socialProfile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialProfile.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/guestbook">guestbook</Link>
            </li>
          </ul>
        </div>
        <SpinningCdMotion />
      </div>
    </footer>
  );
}
