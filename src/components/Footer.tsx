"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeFooter } from "@/components/HomeFooter";
import { profile } from "@/content/profile";
import { isHomePath } from "@/lib/intro";

/** Site footer. Home uses its own layout; every other page keeps this stack. */
export function Footer() {
  const pathname = usePathname();
  if (isHomePath(pathname)) return <HomeFooter />;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">{profile.nameLockup}</p>
        <p className="site-footer__note">software engineering portfolio</p>
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
    </footer>
  );
}
