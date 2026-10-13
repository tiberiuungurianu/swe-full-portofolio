"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Monogram } from "@/components/Monogram";
import { profile } from "@/content/profile";

/**
 * Site navbar.
 * Reorder or comment out the pieces inside `site-header__inner` to change the layout.
 * Add or remove routes in `PRIMARY_NAV_LINKS`.
 */

const PRIMARY_NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/guestbook", label: "guestbook" },
] as const;

/** Home matches only `/`. Other links stay active on their nested routes. */
function isNavLinkCurrent(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((isOpen) => !isOpen);

  return (
    <header className="site-header">
      {/*
        Flex row (see .site-header__inner in globals.css).
        Reorder or comment out children to hide or realign them.
      */}
      <div className="site-header__inner">
        {/* The monogram is the favicon only. It is not rendered in this bar. */}

        {/* Page links: centered on desktop, a drawer on mobile. */}
        <NavLinks
          pathname={pathname}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigate={closeMobileMenu}
        />

        {/* Shown on small screens. Desktop hides this control in CSS. */}
        <MenuButton isMenuOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
      </div>
    </header>
  );
}

/** Monogram link back to home. The name lockup is left out of the navbar on purpose. */
export function BrandLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className="brand-lockup"
      aria-label={`${profile.monogramLabel} — ${profile.nameLockup}`}
      onClick={onNavigate}
    >
      <Monogram className="brand-lockup__mark" />
    </Link>
  );
}

/** Opens and closes the mobile link drawer. */
export function MenuButton({
  isMenuOpen,
  onToggle,
}: {
  isMenuOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="nav-toggle"
      aria-expanded={isMenuOpen}
      aria-controls="site-nav"
      onClick={onToggle}
    >
      <span className="sr-only">Menu</span>
      <span aria-hidden="true">{isMenuOpen ? "close" : "menu"}</span>
    </button>
  );
}

/** Renders `PRIMARY_NAV_LINKS` and marks the link for the current path. */
export function NavLinks({
  pathname,
  isMobileMenuOpen,
  onNavigate,
}: {
  pathname: string;
  isMobileMenuOpen: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav
      id="site-nav"
      className={isMobileMenuOpen ? "site-nav site-nav--open" : "site-nav"}
      aria-label="Primary"
    >
      <ul>
        {PRIMARY_NAV_LINKS.map(({ href, label }) => {
          const isCurrentPage = isNavLinkCurrent(href, pathname);

          return (
            <li key={href}>
              <Link
                href={href}
                className={isCurrentPage ? "is-active" : undefined}
                aria-current={isCurrentPage ? "page" : undefined}
                onClick={onNavigate}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
