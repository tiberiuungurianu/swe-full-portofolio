import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";

import { Footer } from "@/components/Footer";
import { InspectJoke } from "@/components/InspectJoke";
import { IntroBootScript } from "@/components/IntroBootScript";
import { Navbar } from "@/components/Navbar";
import { TerminalIntro } from "@/components/TerminalIntro";
import { profile } from "@/content/profile";
import { siteOrigin } from "@/lib/site";

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
  metadataBase: new URL(siteOrigin()),
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
    icon: [{ url: "/tu-monogram.png", type: "image/png" }],
    apple: [{ url: "/tu-monogram.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${newsreader.variable} ${sourceSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="site-shell antialiased">
        <IntroBootScript />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <TerminalIntro />
        <InspectJoke />
      </body>
    </html>
  );
}
