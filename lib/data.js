// ============================================================
// Site-wide data — keep all content here for easy customization.
// A future dashboard / AI agent can modify this file to
// dynamically select projects, update experience, etc.
// ============================================================

export const siteConfig = {
  name: "Mohamed Hazem Hassine",
  title: "MOHAMED HAZEM HASSINE",
  role: "SOFTWARE ENGINEER & ENTHUSIAST",
  tagline:
    "I build intelligent systems and digital experiences that solve real problems.",
  bio: [
    "I enjoy building systems that combine clean code with meaningful impact. My focus lies in AI-powered applications, full stack development, and creating seamless user experiences.",
    "Currently pursuing my Master's in Intelligent Interactive Systems at Bielefeld University.",
  ],
  location: "Bielefeld, Germany",
  email: "hazemhassine.edu@gmail.com",
  github: "https://github.com/HazemHassine",
  linkedin: "https://www.linkedin.com/in/hazem-hassine",
  copyright: `© ${new Date().getFullYear()} Mohamed Hazem Hassine. All rights reserved.`,
};

export const navigation = [
  { label: "HOME", href: "/", number: "01", icon: "home" },
  { label: "ABOUT", href: "/about", number: "02", icon: "person" },
  { label: "WORK", href: "/work", number: "03", icon: "work" },
  { label: "BLOG", href: "/blog", number: "04", icon: "article" },
  { label: "CONTACT", href: "/contact", number: "05", icon: "mail" },
];

export const experience = [
  {
    year: "2024",
    company: "SIEMENS AG",
    role: "UX Data Analyst (Working Student)",
    location: "Bielefeld, Germany",
    description:
      "Analyzing UX data and creating insights that drive product decisions. Collaborating with cross-functional teams.",
  },
  {
    year: "2023",
    company: "BASIRA LABS",
    role: "AI Research Intern",
    location: "London, UK",
    description:
      "Worked on NLP models and data pipelines. Researched methods to improve model robustness.",
  },
  {
    year: "2022",
    company: "FREELANCE",
    role: "Full Stack Developer",
    location: "Remote",
    description:
      "Built full stack web applications for clients using Next.js, Node.js and Docker.",
  },
  {
    year: "2021",
    company: "ISIMM",
    role: "Teaching Assistant",
    location: "Monastir, Tunisia",
    description:
      "Assisted in teaching data structures and algorithms. Guided students and graded assignments.",
  },
];

export const projects = [
  {
    id: "01",
    title: "ARBITER",
    subtitle: "Local-first dev environment control plane",
    description:
      "A control plane for understanding and safely operating development environments. Connects projects, containers, processes, ports, and configuration in a live topology with typed operations, rollback-aware editing, and optional agent interfaces.",
    tech: ["Python", "FastAPI", "Next.js", "Docker", "LangGraph"],
    href: "https://github.com/HazemHassine/Arbiter",
  },
  {
    id: "02",
    title: "REPOTRAJECTORY",
    subtitle: "OSS momentum & health analytics",
    description:
      "An explainable research platform for tracking the momentum and health of open-source software. Combines GitHub REST data with durable collection jobs and transparent scoring for traceable metrics.",
    tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "GitHub API"],
    href: "https://github.com/HazemHassine/github_analysis",
  },
  {
    id: "03",
    title: "OSS MAINTAINER",
    subtitle: "GitHub repo monitoring console",
    description:
      "An evidence-first operations console for monitoring authorized GitHub repositories. Evaluates CI against exact default-branch commits and preserves scan history and raw evidence.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Playwright"],
    href: "https://github.com/HazemHassine/github_maintainer",
  },
  {
    id: "04",
    title: "FORMA",
    subtitle: "Job application workspace",
    description:
      "A local-first workspace for the full job-application process. Connects résumé versioning, application tracking, company research, and cover-letter creation with bounded LangGraph workflows.",
    tech: ["Python", "FastAPI", "React", "SQLite", "LangGraph"],
    href: "https://github.com/HazemHassine/Forma",
  },
  {
    id: "05",
    title: "GEMINI-MCP",
    subtitle: "Repository intelligence MCP server",
    description:
      "Repository intelligence exposed as tools for coding agents. Combines deterministic code navigation with Gemini-assisted planning, LanceDB semantic retrieval, and local SQLite history.",
    tech: ["Python", "MCP", "Gemini", "LanceDB", "SQLite"],
    href: "https://github.com/HazemHassine/Gemini-Mcp",
  },
  {
    id: "06",
    title: "RSVP SHIFT",
    subtitle: "Chrome extension for speed reading",
    description:
      "A privacy-focused Chrome extension for fast, distraction-free reading. Uses focus-letter alignment, punctuation-aware timing, and adjustable controls while processing all text locally.",
    tech: ["JavaScript", "Chrome Extensions", "Manifest V3"],
    href: "https://github.com/HazemHassine/RSVP-Shift",
  },
];

export const skills = [
  { name: "FULL STACK DEV", level: 4 },
  { name: "AI / ML", level: 3 },
  { name: "CLOUD INFRA", level: 3 },
  { name: "UI / UX DESIGN", level: 2 },
  { name: "DATA ANALYSIS", level: 4 },
];

export const techStack = [
  { name: "Next.js", icon: "data_object" },
  { name: "TypeScript", icon: "terminal" },
  { name: "Python", icon: "code_blocks" },
  { name: "React", icon: "hub" },
  { name: "Docker", icon: "view_in_ar" },
  { name: "FastAPI", icon: "bolt" },
  { name: "MongoDB", icon: "database" },
  { name: "TailwindCSS", icon: "css" },
  { name: "SQLite", icon: "storage" },
];

// blogPosts has been migrated to content/blog/*.md files
