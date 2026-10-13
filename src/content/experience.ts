export type ExperienceItem = {
  id: string;
  role: string;
  organisation: string;
  period: string;
  summary: string;
  highlights?: string[];
};

export type EducationItem = {
  id: string;
  title: string;
  organisation: string;
  period: string;
  detail: string;
  logo: string;
};

export const experience: ExperienceItem[] = [
  {
    id: "bubbled",
    role: "Founder’s Associate Intern",
    organisation: "Bubbled",
    period: "July – September 2025",
    summary:
      "Product and engineering support for an EdTech MVP after the London Metropolitan University × FounderMatcha hackathon.",
    highlights: [
      "Contributed to front-end architecture with React, TypeScript and Vite.",
      "Personal contribution was part of a wider team effort with founders and collaborators.",
    ],
  },
  {
    id: "ethical-hacking-clinic",
    role: "Ethical hacking clinic",
    organisation: "London Metropolitan University",
    period: "2025",
    summary:
      "Structured ethical hacking clinic experience assessing WordPress systems, documenting findings and remediation advice under academic clinic constraints.",
  },
];

export const education: EducationItem[] = [
  {
    id: "beng",
    title: "BEng Software Engineering — First Class Honours",
    organisation: "London Metropolitan University",
    period: "2025",
    detail:
      "Final-year work included full-stack engineering, cybersecurity practice and research into sustainable website design.",
    logo: "/logos/london-met.png",
  },
  {
    id: "kcl",
    title: "Computer Science — Undergraduate Certificate",
    organisation: "King’s College London",
    period: "Prior study",
    detail:
      "Undergraduate Computer Science study with an Undergraduate Certificate. Not a completed King’s bachelor’s degree.",
    logo: "/logos/kings-college-london.png",
  },
];
