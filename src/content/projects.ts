export type ProjectLink = {
  label: string;
  href: string;
};

/** A labelled line inside a project-page section. `detail` may use `backticks` for code. */
export type ProjectPoint = {
  label: string;
  detail: string;
};

/** Extra sections rendered only on `/projects/[slug]`, after the short summary. */
export type ProjectSection = {
  heading: string;
  paragraphs?: string[];
  points?: ProjectPoint[];
  /** `rows[n][0]` is the row header. Later cells match `columns` from index 1. */
  table?: {
    columns: string[];
    rows: string[][];
  };
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
  /** Longer build notes. Omitted projects keep the short summary only. */
  sections?: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "pennypilot",
    title: "PennyPilot",
    shortSummary:
      "Local-first personal finance. Python reads bank-statement PDFs on your machine and serves a small dashboard over localhost.",
    role: "Solo builder.",
    problem:
      "Bank PDFs are awkward when you want spending, budgets, recurring payments, and what is safe to spend. Those statements should stay on the machine that already has the files.",
    approach:
      "One Python process imports statements, categorises transactions, and serves the dashboard locally. The browser talks only to that server. State lives in files: CSV, JSON, Excel, and XML, with PDF as the statement input.",
    technologies: [
      "Python 3",
      "HTML",
      "CSS",
      "JavaScript",
      "pdfplumber",
      "pandas",
      "openpyxl",
    ],
    results:
      "A local dashboard for overview, transactions, spending, budgets, exports, safe-to-spend, and recurring payments. Parsers cover current-account and credit-card statements.",
    status:
      "Personal tool; repository on GitHub. Public demo detail stays limited because the app reads local bank statements.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tiberiuungurianu/pennypilot",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "No public screenshot — the dashboard only runs on localhost.",
    sections: [
      {
        heading: "Languages",
        paragraphs: [
          "PennyPilot is written in four languages. Python does the processing. The dashboard is plain HTML, CSS, and JavaScript. Notes live in Markdown (`README.md`, `DESIGN.md`, and specs under `docs/` and `ui/`).",
        ],
        points: [
          {
            label: "Python 3",
            detail:
              "The application. It imports bank statements, categorises transactions, calculates budgets and safe-to-spend, and writes exports. The package lives in `src/`, with `main.py` as the batch entry point and `src/ui_server.py` as the local server.",
          },
          {
            label: "HTML",
            detail:
              "Two pages: `ui/index.html` (overview, transactions, spending, budgets, exports, safe-to-spend) and `ui/recurring.html`.",
          },
          {
            label: "CSS",
            detail:
              "One hand-written stylesheet, `ui/styles.css`.",
          },
          {
            label: "JavaScript",
            detail:
              "Vanilla ES modules: `ui/app.js`, `ui/recurring.js`, and `ui/common.js`. The browser fetches JSON from the local server and renders the dashboard.",
          },
        ],
      },
      {
        heading: "Runtime and libraries",
        paragraphs: [
          "Python 3 is the whole backend. `main.py` runs import and calculations. `python3 -m src.ui_server` serves the dashboard locally.",
          "Three packages are installed from `requirements.txt`. Everything else is the standard library: `http.server` (`ThreadingHTTPServer`), `json`, `pathlib`, `re`, `xml.etree.ElementTree`, `hashlib`, `uuid`, `argparse`, `shutil`, and `datetime`.",
        ],
        points: [
          {
            label: "pdfplumber",
            detail: "Reads text out of bank-statement PDFs.",
          },
          {
            label: "pandas",
            detail:
              "Holds transaction tables and does aggregation, monthly summaries, and exports.",
          },
          {
            label: "openpyxl",
            detail:
              "Writes Excel workbooks, including styled dashboard sheets.",
          },
        ],
      },
      {
        heading: "Backend",
        paragraphs: [
          "A single-process Python package under `src/`. The UI server is a threaded HTTP handler that serves static files and JSON APIs such as `/api/dashboard`, `/api/transactions`, and `/api/months`. On startup it can run a full update: detect the bank, parse the PDF, clean and categorise rows, then write exports.",
          "Statement parsers cover current-account exports and credit cards. Categorisation is rule-based: keywords, payee aliases, a taxonomy, and a local learning file. Budget, recurring payments, safe-to-spend, and credit-card breakdowns are computed in Python and returned as JSON.",
        ],
      },
      {
        heading: "Data",
        paragraphs: [
          "There is no SQL database. State lives in files. PDF is the input format for bank statements. XML exports are built with the standard-library XML library.",
        ],
        table: {
          columns: ["Store", "What it holds"],
          rows: [
            [
              "CSV (`data/`)",
              "Transactions, manual entries, overrides, accounts, categories, merchants, monthly summaries, subscriptions.",
            ],
            [
              "JSON (`config/` and `data/`)",
              "Budgets, pay cycle, taxonomy, payee aliases, recurring rules, savings, commitments, merchant learnings, transaction groups.",
            ],
            [
              "Exports (`output/`)",
              "The same datasets written out as CSV, Excel (`.xlsx`), and XML.",
            ],
          ],
        },
      },
      {
        heading: "Frontend",
        paragraphs: [
          "Vanilla HTML, CSS, and JavaScript in `ui/`. `index.html` and `recurring.html` are the two pages. `app.js` and `recurring.js` are ES modules that fetch JSON from the local API and render the dashboard: overview, transactions, spending, budgets, exports, safe-to-spend, and recurring. `common.js` holds shared helpers for fetch, money formatting, and saved UI state.",
          "`styles.css` is hand-written CSS. `DESIGN.md` and the Apple UI rulebook notes record the visual direction; they are design references. The browser only talks to the local server.",
        ],
      },
    ],
  },
  {
    slug: "codepop",
    title: "CodePop",
    shortSummary:
      "Chrome extension (Manifest V3) that records every LeetCode attempt — Accepted, Wrong Answer, TLE and errors — and commits each one to your GitHub repo.",
    role: "Solo builder.",
    problem:
      "Most LeetCode → GitHub tools only keep Accepted solutions. The failed attempts, where most of the learning happens, disappear.",
    approach:
      "Plain ES modules, no bundler. Content scripts capture problem metadata and Monaco editor code on Submit, a MutationObserver reads the verdict, and a service worker drains a persistent queue into atomic Git commits via GitHub’s Git Data API. Auth supports a fine-grained PAT or GitHub OAuth; failed uploads retry automatically.",
    technologies: [
      "Chrome Manifest V3",
      "Vanilla JavaScript (ES modules)",
      "chrome.storage / service workers",
      "GitHub REST + Git Data API",
      "OAuth / fine-grained PAT",
    ],
    results:
      "End-to-end loop: capture → queue → one commit per attempt → popup status. Closer to LeetHub/LeetSync in spirit, but oriented around every attempt, not only Accepted solutions.",
    status: "v0.1.1 — core loop complete; LeetCode DOM selectors remain the fragile spot.",
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
      "Final-year research at London Metropolitan University on sustainable website design: an optimised London Library prototype, measured against the original, and published at IEEE SNAMS.",
    role: "Research lead and full-stack engineer on a final-year project, supervised by Dr Sahar Al-Sudani.",
    problem:
      "The dissertation asked how websites could be designed and developed more sustainably, and produced a framework for that work. The recorded title is Investigating Green Website Design: Developing a Carbon-Neutral Website for the Digital Future Through Optimised Web Solutions.",
    approach:
      "Built an optimised clone of The London Library for desktop and laptop use, then compared it with the original using performance measurements and carbon calculators. React and Vite on the frontend, hosted on Cloudflare Pages. Spring Boot 3.4.2 and Java 21 on the backend.",
    technologies: [
      "React",
      "JavaScript",
      "Vite",
      "HTML/CSS",
      "Java 21",
      "Spring Boot 3.4",
      "Maven",
      "Cloudflare Pages",
      "Git/GitHub",
      "Lighthouse",
    ],
    results:
      "On the 19 April 2025 comparison, page weight fell from 102–107 MB to 255–302 KB, HTTP requests from 120 to 14, and DOM nodes from 669 to 95. Lighthouse performance went from 74 to 100. Carbon calculators estimated about 99.7–99.8% lower emissions. Those are calculator estimates for that comparison.",
    status:
      "Presented at SNAMS 2025 in Vienna. IEEE publication followed in 2026; the exact month is unverified. Cited in an ECSA 2026 Springer chapter and by Stanford researchers at IMC 2026. Live prototype and repository are public.",
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
      {
        label: "ECSA citation",
        href: "https://doi.org/10.1007/978-3-032-39236-7_37",
      },
      {
        label: "Stanford citation",
        href: "https://doi.org/10.1145/3777912.3839788",
      },
    ],
    featured: true,
    hasScreenshot: false,
    previewNote: "Screenshot not available yet — use the live prototype link.",
    sections: [
      {
        heading: "Research",
        paragraphs: [
          "Final-year project at London Metropolitan University. It investigated how websites could be designed and developed more sustainably, and produced a framework for sustainable website design and development.",
          "The build was an optimised clone of The London Library website, compared with the original using environmental estimates and web performance measurements. The original scope focused on desktop and laptop use.",
          "The wider framework also covered renewable-energy hosting, lightweight technologies, maintainable code, and guidance for developers.",
        ],
      },
      {
        heading: "Technology stack",
        paragraphs: [
          "React and Vite on the frontend, Spring Boot 3.4.2 with Java 21 on the backend. The frontend is hosted on Cloudflare Pages. The repository has separate `frontend/` and `backend/` directories, plus `README.md`.",
          "The records do not establish a database, specific API endpoints, backend production hosting, the exact React version, an automated test framework, or Docker.",
        ],
        table: {
          columns: ["Area", "Recorded detail"],
          rows: [
            [
              "Frontend",
              "React, JavaScript, JSX, HTML, and CSS. Packages are managed with npm.",
            ],
            [
              "Build tooling",
              "Vite. The setup used `create-vite@6.2.0` as the scaffolding package. The installed Vite version was not recorded on its own. Commands used were `vite`, `vite build`, and `vite preview`.",
            ],
            [
              "Backend",
              "Spring Boot 3.4.2, built with Maven.",
            ],
            [
              "Java",
              "Runtime Java 21.0.5. One Maven build set the compiler `release` to 17.",
            ],
            [
              "Server",
              "Embedded Tomcat, running locally on port 8080.",
            ],
            [
              "Deployment",
              "Cloudflare Pages for the frontend. Wrangler is a development dependency.",
            ],
            [
              "Version control",
              "Git and GitHub. Repository `tiberiuungurianu/final-project-green-website-investigation`. Prototype at `greenprototypeforinvestigation.uk`.",
            ],
            [
              "Navigation",
              "Component state, including `setSelectedPage`. React Router was not confirmed in the records.",
            ],
          ],
        },
      },
      {
        heading: "Optimisations",
        paragraphs: [
          "The prototype kept the purpose of The London Library site and used a minimalist interface.",
        ],
        points: [
          {
            label: "Images",
            detail:
              "Compressed images, and converted JPG and PNG assets to WebP.",
          },
          {
            label: "Loading",
            detail:
              "Lazy-loaded images and content. Videos loaded only after a button press.",
          },
          {
            label: "Page structure",
            detail:
              "Reduced page weight, HTTP requests, and DOM complexity.",
          },
          {
            label: "Code",
            detail:
              "Removed unused code and minimised HTML, CSS, and JavaScript. Cut unnecessary dependencies and third-party resources.",
          },
          {
            label: "Caching",
            detail: "Improved caching.",
          },
        ],
      },
      {
        heading: "Measured comparison",
        paragraphs: [
          "Figures from the comparison shared on 19 April 2025. The first four carbon comparisons are about 99.7–99.8% lower estimated emissions. They come from carbon calculators.",
          "Evaluation tools were Lighthouse, Website Carbon Calculator, Beacon, Siti Green, Ecograder, and EcoIndex. Lighthouse-result PDFs supported the comparison table in the research paper.",
        ],
        table: {
          columns: ["Metric", "Original website", "Optimised prototype"],
          rows: [
            ["Page weight", "102–107 MB", "255–302 KB"],
            ["HTTP requests", "120", "14"],
            ["DOM nodes", "669", "95"],
            ["Lighthouse performance", "74", "100"],
            ["First Contentful Paint", "0.9 s", "0.4 s"],
            ["Largest Contentful Paint", "2.7 s", "0.8 s"],
            ["Website Carbon estimate", "21.93 g", "0.06 g"],
            ["Beacon carbon estimate", "32.603 g", "0.079 g"],
            ["Siti Green carbon estimate", "25.01 g", "0.06 g"],
            ["Ecograder carbon estimate", "30.68 g", "0.09 g"],
            ["EcoIndex monthly CO₂e estimate", "2.34 kg", "1.26 kg"],
            ["Associated water estimate", "35.1 litres", "18.9 litres"],
          ],
        },
      },
      {
        heading: "Other measurement runs",
        paragraphs: [
          "Other saved results mention DOM nodes falling from 627 to 82, and Largest Contentful Paint around 0.4 seconds. Another evaluation recorded 107 DOM nodes. Those runs stay separate from the 19 April 2025 table until they are matched to the final report.",
        ],
      },
      {
        heading: "Publication",
        paragraphs: [
          "Presented at SNAMS in 2025, then published by IEEE in 2026. The recorded window is around February or March 2026. The exact date is still unverified.",
        ],
        points: [
          {
            label: "Paper",
            detail:
              "A Practical Framework for Sustainable Website Design and Development.",
          },
          {
            label: "Authors",
            detail:
              "Tiberiu-Septimiu Ungurianu, Sahar Al-Sudani, and Ramzi Djemai.",
          },
          {
            label: "Supervisor",
            detail: "Dr Sahar Al-Sudani.",
          },
          {
            label: "Conference",
            detail:
              "SNAMS 2025, Vienna, 25–28 November 2025. Submission number 6925.",
          },
          {
            label: "DOI",
            detail: "`10.1109/SNAMS67467.2025.11391157`.",
          },
          {
            label: "ECSA 2026",
            detail:
              "Cited as reference 20 in Evaluating Green API Patterns Impact Based on the Open Data Hub Request Logs, by Marcelo Nunes, João Daniel, Alessandro Aneggi, Cesare Pautasso, and Eduardo Guerra. Springer, Software Architecture (ECSA 2026). DOI `10.1007/978-3-032-39236-7_37`.",
          },
          {
            label: "Stanford",
            detail:
              "Cited by Rumaisa Habib, Balaji Balachandran, Nurullah Demir, and Zakir Durumeric (Stanford University) in “Stop Trying to Make Fetch Happen”: Towards a Modality-Aware Understanding of Unnecessary Resources on the Web. ACM Internet Measurement Conference (IMC 2026). DOI `10.1145/3777912.3839788`.",
          },
        ],
      },
    ],
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
