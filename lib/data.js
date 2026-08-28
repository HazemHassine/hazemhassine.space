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
    "My background spans software engineering, federated-learning research, IT systems, and product analytics. Currently, I'm pursuing my Master's in Intelligent Interactive Systems at Bielefeld University with a focus on AI and ML. Alongside academia, my work focuses deeply on building agentic AI, RAG, and full-stack AI systems.",
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
  { label: "PROJECTS", href: "/projects", number: "03", icon: "work" },
  { label: "BLOG", href: "/blog", number: "04", icon: "article" },
  { label: "CONTACT", href: "/contact", number: "05", icon: "mail" },
];

export const experience = [
  {
    year: "2025 - 2026",
    company: "SIEMENS",
    role: "UX Data Analyst (Working Student)",
    location: "Nuremberg, Germany",
    description:
      "Analyzed 400K+ user sessions for Insights Hub Monitor and Industrial AI Inference Server. Reconstructed user journeys, discovered behavioral clusters, and built Python analytical pipelines.",
  },
  {
    year: "2024 - 2025",
    company: "INDEPENDENT HIGH AUTHORITY FOR ELECTIONS (ISIE)",
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
    degree: "B.Sc. Software Engineering & Information Systems Architecture",
    location: "Monastir, Tunisia",
    description: "Graduated with 2.4. Focused on Fundamentals of Big Data and Artificial Intelligence.",
  }
];

export const projects = [
  {
    id: "01",
    slug: "arbiter",
    title: "ARBITER",
    subtitle: "Local-first dev environment control plane",
    category: "dev-tools",
    categoryLabel: "DEV TOOLS & SRE",
    description:
      "A control plane for understanding and safely operating development environments. Connects projects, containers, processes, ports, and configuration in a live topology with typed operations, rollback-aware editing, and optional agent interfaces.",
    tech: ["Python", "FastAPI", "Docker", "LangGraph", "SQLite"],
    href: "/projects/arbiter",
    github: "https://github.com/HazemHassine/Arbiter",
    image: "/projects/arbiter/preview.png",
  },
  {
    id: "02",
    slug: "repotrajectory",
    title: "REPOTRAJECTORY",
    subtitle: "OSS momentum & health analytics",
    category: "data",
    categoryLabel: "BIG DATA & OSS",
    description:
      "An explainable research platform for tracking the momentum and health of open-source software. Combines GitHub REST data with durable collection jobs, GH Archive ingestion, and transparent scoring for traceable metrics.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Next.js", "GH Archive"],
    href: "/projects/repotrajectory",
    github: "https://github.com/HazemHassine/github_analysis",
    image: "/projects/repotrajectory/architecture.png",
  },
  {
    id: "03",
    slug: "gitaudit",
    title: "GITAUDIT",
    subtitle: "Evidence-first GitHub profile curator",
    category: "ai-agents",
    categoryLabel: "AI & AGENTS",
    description:
      "An evidence-first operations console for monitoring authorized GitHub repositories. Evaluates CI against exact default-branch commits, maintains scan history, and deploys a bounded LangGraph profile curator.",
    tech: ["Python", "FastAPI", "PostgreSQL", "LangGraph", "Playwright"],
    href: "/projects/gitaudit",
    github: "https://github.com/HazemHassine/github_maintainer",
    image: "/projects/gitaudit/preview.png",
  },
  {
    id: "04",
    slug: "forma",
    title: "FORMA",
    subtitle: "Job application workspace & agentic assistant",
    category: "ai-agents",
    categoryLabel: "AI & AGENTS",
    description:
      "A local-first workspace for the full job-application process. Connects résumé versioning, application tracking, source-backed company research, and cover-letter creation with bounded LangGraph workflows.",
    tech: ["Python", "FastAPI", "React", "SQLite", "LangGraph"],
    href: "/projects/forma",
    github: "https://github.com/HazemHassine/Forma",
    image: "/projects/forma/00-forma-architecture.png",
  },
  {
    id: "05",
    slug: "gemini-mcp",
    title: "GEMINI-MCP",
    subtitle: "Repository intelligence MCP server",
    category: "ai-agents",
    categoryLabel: "AI & AGENTS",
    description:
      "Repository intelligence exposed as tools for coding agents. Combines deterministic code navigation with Gemini-assisted planning, LanceDB semantic retrieval, AST mapping, and local SQLite history.",
    tech: ["Python", "MCP", "Gemini API", "LanceDB", "SQLite"],
    href: "/projects/gemini-mcp",
    github: "https://github.com/HazemHassine/Gemini-Mcp",
    image: "/projects/gemini-mcp/preview.png",
  },
  {
    id: "06",
    slug: "rsvp-shift",
    title: "RSVP SHIFT",
    subtitle: "Chrome extension for speed reading",
    category: "frontend",
    categoryLabel: "FRONTEND & TOOLS",
    description:
      "A privacy-focused Chrome extension for fast, distraction-free reading. Uses focus-letter alignment, punctuation-aware timing, and adjustable controls while processing all text locally.",
    tech: ["JavaScript", "Chrome Extensions", "Manifest V3", "CSS3"],
    href: "/projects/rsvp-shift",
    github: "https://github.com/HazemHassine/RSVP-Shift",
    image: "/projects/rsvp-shift/01_focus_mode.png",
  },
  {
    id: "07",
    slug: "portfolio",
    title: "HAZEMHASSINE.SPACE",
    subtitle: "Brutalist personal space & interactive lab",
    category: "frontend",
    categoryLabel: "FRONTEND & WEBGL",
    description:
      "A high-performance personal engineering space and developer portfolio featuring brutalist aesthetics, interactive 3D WebGL scenes, a Three.js wireframe arcade game, local Markdown blog CMS, and an AI chat assistant.",
    tech: ["Next.js", "React", "TailwindCSS", "Three.js", "Framer Motion"],
    href: "/projects/portfolio",
    github: "https://github.com/HazemHassine/hazemhassine.space",
    image: "/projects/portfolio/preview.png",
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

export function getProjectThumbnail(project) {
  if (project?.image) {
    return project.image;
  }
  if (project?.github && project.github.includes("github.com")) {
    const match = project.github.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "");
      return `https://raw.githubusercontent.com/${owner}/${repo}/main/thumbnail/preview.png`;
    }
  }
  if (project?.href && project.href.includes("github.com")) {
    const match = project.href.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "");
      return `https://raw.githubusercontent.com/${owner}/${repo}/main/thumbnail/preview.png`;
    }
  }
  return null;
}

