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
    "AI-focused software engineer building agentic systems, developer tools, and thoughtful products.",
  bio: [
    "AI-focused software engineer building agentic systems, developer tools, and thoughtful products.",
    "My background spans software engineering, federated-learning research, IT systems, and product analytics. Currently, I'm pursuing my Master's in Intelligent Interactive Systems at Bielefeld University, focusing deeply on agentic AI, RAG, and full-stack AI systems.",
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
    year: "2025 - 2026",
    company: "SIEMENS",
    role: "UX Data Analyst (Working Student)",
    location: "Bielefeld, Germany",
    description:
      "Analyzed 400K+ user sessions for Insights Hub Monitor and Industrial AI Inference Server. Reconstructed user journeys, discovered behavioral clusters, and built Python analytical pipelines.",
  },
  {
    year: "2024 - 2025",
    company: "HIGH AUTHORITY FOR ELECTIONS",
    role: "Information System Specialist",
    location: "Tunisia",
    description:
      "Maintained internal information systems, automated repetitive data-processing work, and onboarded/trained 100+ staff members on digital systems.",
  },
  {
    year: "2023",
    company: "BASIRA / IMPERIAL COLLEGE LONDON",
    role: "Machine Learning Researcher Intern",
    location: "London, UK",
    description:
      "Collaborated on FedLIMIT, studying privacy-preserving collaborative learning. Developed PyTorch deep-learning models in federated environments for medical-image classification.",
  },
  {
    year: "2022",
    company: "MAKE IT HAPPEN",
    role: "Web Developer Intern",
    location: "Tunisia",
    description:
      "Developed React components and improved JavaScript frontend performance for a responsive e-commerce application.",
  },
];

export const education = [
  {
    year: "2025 - Present",
    institution: "BIELEFELD UNIVERSITY",
    degree: "M.Sc. Intelligent Interactive Systems",
    location: "Bielefeld, Germany",
    description: "Focusing on AI systems, deep learning, reinforcement learning, and autonomous agents.",
  },
  {
    year: "2024 - 2025",
    institution: "UNIVERSITY OF PASSAU",
    degree: "M.Sc. Computer Science",
    location: "Passau, Germany",
    description: "Coursework focused on intelligent technical systems, networks, and databases before transferring to specialize in AI.",
  },
  {
    year: "2020 - 2023",
    institution: "UNIVERSITY OF MONASTIR / ISIMM",
    degree: "B.Sc. Software Engineering & Information Systems",
    location: "Monastir, Tunisia",
    description: "Graduated with 2.4. Focused on Fundamentals of Big Data and Artificial Intelligence.",
  }
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
