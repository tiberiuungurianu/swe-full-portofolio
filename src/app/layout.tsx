import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { profile } from "@/content/profile";

import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — software engineer`,
    template: `%s — ${profile.name}`,
  },
  description: profile.positioning,
  applicationName: profile.nameLockup,
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — software engineer`,
    description: profile.positioning,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — software engineer`,
    description: profile.positioning,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/tu-monogram.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${newsreader.variable} ${sourceSans.variable} h-full`}
    >
      <body className="site-shell antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="site-main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
