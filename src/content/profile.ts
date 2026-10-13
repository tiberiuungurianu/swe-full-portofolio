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
    "A software engineer working in cybersecurity, with a passion for algorithms, finance and building things.",
  location: "London, United Kingdom",
  focus:
    "Software engineering is the main focus. Cybersecurity and identity engineering sit alongside professional experience in building reliable systems.",
  bio: [
    "I am a software engineer based in London. My work sits at the intersection of product engineering, identity and access management, and practical cybersecurity.",
    "I care about clear systems, careful testing and software that stays maintainable under real constraints — whether that means an identity pipeline, a research prototype or a small product MVP.",
    "Outside day-to-day delivery I keep returning to algorithms, finance-shaped problems and research into sustainable web engineering.",
  ],
  skills: {
    languages: ["Python", "Java", "C++", "SQL", "C#"],
    frameworks: ["React / TypeScript", "Spring Boot", "FastAPI", "ASP.NET MVC"],
    platforms: ["PostgreSQL", "Docker", "Git", "Linux"],
    domains: ["Identity engineering", "Cybersecurity engineering"],
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
