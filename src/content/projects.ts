export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  shortSummary: string;
  role: string;
  problem: string;
  approach: string;
  technologies: string[];
  results: string;
  status: string;
  links: ProjectLink[];
  featured: boolean;
  /** When false, show an honest neutral preview instead of inventing media. */
  hasScreenshot: boolean;
  previewNote: string;
};

export const projects: Project[] = [
  {
    slug: "pennypilot",
    title: "PennyPilot",
    shortSummary:
      "Local financial analysis from bank statement PDFs — a personal tool that turns messy statements into clearer spending insight.",
    role: "Solo builder.",
    problem:
      "Bank PDFs are awkward to read when you want a quick picture of where money goes. Spreadsheet busywork gets in the way of the actual question.",
    approach:
      "Built a local workflow that starts from statement PDFs, extracts useful transaction signal, and surfaces analysis without sending bank data to a remote service by default. It sits at the intersection of finance curiosity and practical tooling.",
    technologies: ["Python", "PDF parsing", "Local data analysis"],
    results:
      "A working personal finance helper oriented around statement PDFs rather than a full banking product. Public demo detail stays limited because the tool handles sensitive local data.",
    status: "Personal tool; repository on GitHub.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/pennypilot",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "No public screenshot linked yet — local finance tool.",
  },
  {
    slug: "codepop",
    title: "CodePop",
    shortSummary:
      "A browser extension for LeetCode — built for people who grind problems and want a better practice loop.",
    role: "Solo builder.",
    problem:
      "LeetCode practice can feel noisy. I wanted a lighter companion for the main problem workflow without spinning up extra submission trackers as the story.",
    approach:
      "Shipped CodePop as the primary extension for LeetCode practice. Related submission archives and earlier attempts stay outside this project write-up on purpose.",
    technologies: ["JavaScript", "Browser extension APIs", "LeetCode workflow"],
    results:
      "A focused LeetCode companion. The public face of the work is the extension itself, not the side repos around submissions.",
    status: "Public extension repository on GitHub.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/CodePop---for-true-LeetCode-warriors",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "Extension UI screenshot not linked yet.",
  },
  {
    slug: "green-website-investigation",
    title: "Green Website Investigation",
    shortSummary:
      "Research on sustainable website design and development, with measured results and an IEEE SNAMS publication.",
    role: "Research lead and full-stack engineer (final-year project).",
    problem:
      "Heavy websites burn unnecessary bytes and energy. The work asked how design and engineering choices show up in measured performance and estimated environmental impact.",
    approach:
      "Built and compared optimised implementations, reduced code and assets, and evaluated results with performance tooling in a documented test context. The research later informed an IEEE SNAMS 2025 publication.",
    technologies: [
      "React",
      "Vite",
      "Spring Boot 3",
      "Java 21",
      "Performance analysis tooling",
    ],
    results:
      "In the documented test context, LCP was measured around 0.4s and DOM nodes were reduced from 627 to 82. Those figures describe that measurement setup; they do not by themselves prove results on every device or quantify carbon everywhere.",
    status: "Academic research completed; live prototype and IEEE publication available.",
    links: [
      {
        label: "Live prototype",
        href: "https://greenprototypeforinvestigation.uk/",
      },
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/final-project-green-website-investigation",
      },
      {
        label: "IEEE publication (DOI)",
        href: "https://doi.org/10.1109/SNAMS67467.2025.11391157",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "Screenshot not available yet — use the live prototype link.",
  },
  {
    slug: "password-manager",
    title: "Password Manager & Strength Analyser",
    shortSummary:
      "A C# ASP.NET project that connects software engineering with cybersecurity — vault flows, strength analysis and security-minded coursework decisions.",
    role: "Software developer on a two-person academic team project.",
    problem:
      "Weak and reused passwords are common. The brief asked for a managed vault with strength analysis, reuse detection and role-aware access.",
    approach:
      "Implemented an ASP.NET Core MVC application with Identity authentication, two-factor authentication, encrypted storage patterns taught in the module, strength scoring, reuse checks and xUnit/Moq coverage. Security claims stay coursework-scoped, not production certification.",
    technologies: [
      "C#",
      "ASP.NET Core MVC",
      "Entity Framework Core",
      "SQL Server",
      "xUnit",
      "Moq",
    ],
    results:
      "Delivered as an academic team project to First Class coursework expectations, with documentation and automated tests.",
    status: "Academic project; repository public on GitHub.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/Password_Manager-Strength_Analyzer",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "No project screenshot linked yet.",
  },
  {
    slug: "romanian-orthodox-calendar",
    title: "Romanian Orthodox Calendar",
    shortSummary:
      "A personal utility I needed: a Romanian Orthodox calendar you can subscribe to as an iCalendar feed.",
    role: "Solo builder.",
    problem:
      "I wanted saints, feasts and fasting days in the calendar apps I already use — without rebuilding the year by hand every season.",
    approach:
      "Built a subscribable calendar feed and a small web front end so the same link works in Apple Calendar, Google Calendar and Outlook. The point is the idea: I needed it, so I built it.",
    technologies: ["iCalendar (.ics)", "Web calendar UI", "Feed subscription"],
    results:
      "A live calendar people can open or subscribe to. The feed rolls forward across months rather than freezing a single static year.",
    status: "Live on Netlify; source on GitHub.",
    links: [
      {
        label: "Live site",
        href: "https://cerulean-buttercream-9a34a2.netlify.app/",
      },
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/romanian-orthodox-calendar",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "Open the live site for the current calendar UI.",
  },
  {
    slug: "bubbled-mvp",
    title: "Bubbled",
    shortSummary:
      "EdTech product work from the London Metropolitan × FounderMatcha hackathon through a Founder’s Associate internship — now live at gobubbled.com.",
    role: "Hackathon contributor, then Founder’s Associate Intern supporting product and front-end delivery.",
    problem:
      "Students aiming for universities abroad need guidance that feels personal and practical, not a five-figure agency black box.",
    approach:
      "Contributed to a React/TypeScript/Vite front end, API integration and responsive UI during the hackathon and internship. Distinguishing contribution: front-end architecture and implementation support within a team; product direction stayed collaborative with founders and other coaches.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "REST APIs"],
    results:
      "Hackathon recognition included Best Presentation and Best Solution for the Bubbled challenge. The product continued beyond the MVP and is publicly available.",
    status: "Live product; hackathon and internship collaboration.",
    links: [
      {
        label: "Live site",
        href: "https://gobubbled.com/",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "Use the live Bubbled site for current product UI.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
