export type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const profile = {
  name: "Tiberiu Ungurianu",
  nameLockup: "tiberiu ungurianu",
  monogramLabel: "tu",
  shortIntro: "hi, i’m tiberiu.",
  positioning:
    "A software engineer with a passion for algorithms, finance and building things.",
  location: "London, United Kingdom",
  bio: [
    "I’m a London-based software engineer with a particular interest in cybersecurity, algorithms and finance.",
    "I enjoy figuring out how things work and building tools that make my life easier.",
  ],
  bioAside:
    "(Usually because something repetitive has annoyed me enough to automate it, tehehe.)",
  research:
    "My final-year research explored how websites can be designed and built more sustainably. I developed a framework to support this, and the research was later published at IEEE in 2026 and was presented at SNAMS 2025.",
  skills: {
    languages: ["Python", "Java", "C++", "SQL", "C#"],
    frameworks: ["React / TypeScript", "Spring Boot", "FastAPI", "ASP.NET MVC"],
    platforms: ["PostgreSQL", "Docker", "Git", "Linux"],
    domains: ["Cybersecurity engineering"],
  },
  publication: {
    title:
      "A Practical Framework for Sustainable Website Design and Development",
    authors: "Tiberiu-Septimiu Ungurianu, Sahar Al-Sudani, Ramzi Djemai",
    venue:
      "2025 12th International Conference on Social Networks Analysis, Management and Security (SNAMS)",
    doi: "10.1109/SNAMS67467.2025.11391157",
    href: "https://doi.org/10.1109/SNAMS67467.2025.11391157",
    verified: true,
  },
  social: [
    {
      label: "GitHub",
      href: "https://github.com/tiberiuungurianu",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tiberiu-septimiu-ungurianu",
      external: true,
    },
  ] satisfies SocialLink[],
  /** Contact destinations that are ready to show publicly. */
  contact: [
    {
      label: "GitHub",
      href: "https://github.com/tiberiuungurianu",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tiberiu-septimiu-ungurianu",
      external: true,
    },
  ] satisfies SocialLink[],
  /** Placeholders until real destinations are supplied. */
  missing: {
    email: "Public email not listed yet.",
    cv: "Downloadable CV not linked yet.",
    productionDomain: "Production domain not chosen yet.",
  },
} as const;
