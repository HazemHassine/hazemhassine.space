export const pageContentDefaults = {
  seo: {
    siteTitle: "HAZEM HASSINE | Software Engineer",
    siteDescription: "AI-focused software engineer building agentic systems, developer tools, and thoughtful products. MSc Intelligent Interactive Systems at Bielefeld University.",
    keywords: ["software engineer", "AI", "agentic systems", "developer tools", "portfolio", "Hazem Hassine"],
    pages: {
      about: {
        title: "About | Hazem Hassine",
        description: "AI-focused software engineer building agentic systems and thoughtful products. Discover my background and skills.",
      },
      projects: {
        title: "Projects | Mohamed Hazem Hassine",
        description: "A curated selection of engineering projects, tools, and experiments focusing on full-stack development, system architecture, and AI integrations.",
      },
      blog: {
        title: "Blog | Hazem Hassine",
        description: "Writings on AI, software engineering, agentic systems, and developer tools.",
      },
      contact: {
        title: "Contact | Hazem Hassine",
        description: "Get in touch for collaborations, opportunities, or just to say hello.",
      },
    },
  },
  home: {
    marquee: [
      "ORCHESTRATING 13 AGENTS SIMULTANEOUSLY",
      "WRITING DEVELOPMENT LOOPS",
      "PROMPT ENGINEERING SURVIVOR",
      "LLM WHISPERER",
      "FINE-TUNING THE MULTIVERSE",
    ],
    experienceLabel: "/ EXPERIENCE",
    projectsLabel: "/ PROJECTS",
    blogLabel: "/ BLOG",
    timelineCta: "[ FULL TIMELINE ]",
    projectsCta: "[ VIEW ALL PROJECTS ]",
    blogCta: "[ READ ALL ARTICLES ]",
  },
  about: {
    eyebrow: "// ABOUT ME",
    heading: "I'M HAZEM, A SOFTWARE ENGINEER BASED IN BIELEFELD, GERMANY.",
    currentFocusLabel: "CURRENT FOCUS",
    currentFocus: "M.Sc. Intelligent Interactive Systems @ Bielefeld University",
    skillsLabel: "// CAPABILITIES & STACK",
    cvLabel: "[ DOWNLOAD CV ]",
    cvUrl: "/Hazem_Hassine_CV.pdf",
    contactLabel: "[ CONTACT ]",
  },
  projects: {
    telemetryLabel: "SYSTEM TELEMETRY",
    title: "/ PROJECTS",
    introduction: "Production-grade systems, autonomous agent control planes, explainable analytics pipelines, and interactive developer tools.",
    searchPlaceholder: "SEARCH CODEBASES...",
  },
  blog: {
    title: "BLOG / NOTES",
    emptyState: "No published articles yet.",
  },
  contact: {
    eyebrow: "/ GET IN TOUCH",
    introduction: "Have a project in mind, a question, or just want to say hello? Drop a message below or reach out directly via email.",
    displayTitle: "LET'S\nTALK",
    submitLabel: "[ SEND MESSAGE ]",
    successMessage: "Message sent successfully!",
  },
};

export const themeDefaults = {
  accent: "#ccf200",
  accentDim: "#b3d400",
  background: "#131313",
  surface: "#090909",
  surfaceElevated: "#201f1f",
  primaryText: "#ffffff",
  mutedText: "#9a9a9a",
  dimText: "#646464",
  border: "#343434",
  danger: "#ff1a14",
};

export const themeToCssVariables = (theme = {}) => ({
  "--color-primary-fixed": theme.accent,
  "--color-primary-container": theme.accent,
  "--color-primary-fixed-dim": theme.accentDim,
  "--color-surface-tint": theme.accentDim,
  "--color-background": theme.background,
  "--color-surface-dim": theme.background,
  "--color-surface": theme.surface,
  "--color-surface-container": theme.surfaceElevated,
  "--color-primary": theme.primaryText,
  "--color-text-muted": theme.mutedText,
  "--color-text-dim": theme.dimText,
  "--color-border-primary": theme.border,
  "--color-danger": theme.danger,
});

export const CMS_CLIENT_KEYS = [
  "siteConfig",
  "navigation",
  "experience",
  "education",
  "projects",
  "skills",
  "skillCategories",
  "techStack",
  "pageContent",
  "theme",
];
