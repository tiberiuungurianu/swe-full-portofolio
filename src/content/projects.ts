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
    slug: "green-website-investigation",
    title: "Green Website Investigation",
    shortSummary:
      "Research and engineering on website performance and environmental impact, with a React + Vite front end and a Spring Boot 3 / Java 21 back end.",
    role: "Research lead and full-stack engineer (final-year project).",
    problem:
      "Heavy websites consume unnecessary bytes and energy. The work investigated how design and engineering choices affect measured performance and estimated environmental impact.",
    approach:
      "Built and compared optimised implementations, applied code and asset reduction techniques, and evaluated results with performance tooling in a documented test context. The research later informed an IEEE SNAMS 2025 publication.",
    technologies: [
      "React",
      "Vite",
      "Spring Boot 3",
      "Java 21",
      "Performance analysis tooling",
    ],
    results:
      "In the documented test context, LCP was measured around 0.4s and DOM nodes were reduced from 627 to 82. These figures describe that specific measurement setup; they do not by themselves prove results across all devices or directly quantify carbon in every environment.",
    status: "Academic research completed; IEEE publication available via DOI.",
    links: [
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
    previewNote: "Screenshot not available yet — neutral project preview.",
  },
  {
    slug: "rfp-finder",
    title: "RFP Finder",
    shortSummary:
      "A full-stack tool built with FastAPI, PostgreSQL, React and Docker for working with RFP-oriented workflows.",
    role: "Full-stack engineer.",
    problem:
      "Finding and organising request-for-proposal style information is tedious when the workflow is scattered across tools.",
    approach:
      "Structured as an API-backed web application with a PostgreSQL data store and containerised local development. Public feature detail is intentionally limited until a clearer public write-up is available.",
    technologies: ["FastAPI", "PostgreSQL", "React", "Docker"],
    results:
      "Public results, screenshots and live demo links are not published here yet. Status and scope will be expanded when verified material is available.",
    status: "Described from available stack information; public case-study detail pending.",
    links: [],
    featured: true,
    hasScreenshot: false,
    previewNote: "No public screenshot supplied yet.",
  },
  {
    slug: "password-manager",
    title: "Password Manager",
    shortSummary:
      "Academic ASP.NET MVC password manager and strength analyser with authentication, tagging and automated tests.",
    role: "Software developer on a two-person academic team project.",
    problem:
      "People reuse weak passwords. The academic brief asked for a managed vault with strength analysis, reuse detection and role-aware access.",
    approach:
      "Implemented an ASP.NET Core MVC application with Identity-based authentication, two-factor authentication, encrypted password storage patterns taught in the module, strength scoring, reuse checks and xUnit/Moq coverage. This is an academic project — not a claim of production-grade security assurance.",
    technologies: [
      "C#",
      "ASP.NET Core MVC",
      "Entity Framework Core",
      "SQL Server",
      "xUnit",
      "Moq",
    ],
    results:
      "Delivered as an academic team project to First Class standard coursework expectations, with documentation and automated tests. Treat security claims as coursework-scoped rather than production certification.",
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
    slug: "bubbled-mvp",
    title: "Bubbled MVP",
    shortSummary:
      "React + Vite EdTech MVP from the London Metropolitan University × FounderMatcha hackathon (June 2025), later continued through a Founder’s Associate internship.",
    role: "Hackathon contributor, then Founder’s Associate Intern supporting product and front-end delivery.",
    problem:
      "Early-stage EdTech ideas need a credible MVP interface and enough engineering structure to iterate with founders and advisors.",
    approach:
      "During the hackathon and later internship, contributed to a React/TypeScript/Vite front end, API integration and responsive UI work. Distinguishing contribution: front-end architecture and implementation support within a team; product direction remained collaborative with founders and other contributors.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "REST APIs"],
    results:
      "Hackathon recognition included Best Presentation and Best Solution for the Bubbled challenge. Internship work continued the MVP rather than restarting from a solo codebase.",
    status: "Hackathon MVP and internship collaboration; no public live demo linked here.",
    links: [],
    featured: true,
    hasScreenshot: false,
    previewNote: "Demo imagery not published on this site yet.",
  },
  {
    slug: "identity-csv-transformer",
    title: "Identity CSV Transformer",
    shortSummary:
      "Identity onboarding helper focused on CSV transformation, validation feedback and outcome reporting.",
    role: "Engineering work in an identity context.",
    problem:
      "Identity onboarding often depends on messy tabular inputs that need validation before they can be trusted downstream.",
    approach:
      "Public detail is intentionally limited. Cleared technical shape: H2/PostgreSQL, Flyway migrations, file-specific transformers, validation warnings/errors and an outcome endpoint. Client data, internals, credentials and confidential logs are excluded.",
    technologies: ["Java ecosystem", "H2 / PostgreSQL", "Flyway"],
    results:
      "Detailed public case study omitted where material is not cleared for publication.",
    status: "Limited public write-up by design.",
    links: [],
    featured: false,
    hasScreenshot: false,
    previewNote: "No public screenshot — work-related material kept minimal.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
