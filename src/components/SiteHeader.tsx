"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Monogram } from "@/components/Monogram";
import { profile } from "@/content/profile";

const navItems = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
  { href: "/guestbook", label: "guestbook" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          className="brand-lockup"
          aria-label={`${profile.monogramLabel} — ${profile.nameLockup}`}
          onClick={() => setOpen(false)}
        >
          <Monogram className="brand-lockup__mark" />
          <span className="brand-lockup__name">{profile.nameLockup}</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true">{open ? "close" : "menu"}</span>
        </button>

        <nav
          id="site-nav"
          className={open ? "site-nav site-nav--open" : "site-nav"}
          aria-label="Primary"
        >
          <ul>
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={active ? "is-active" : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
