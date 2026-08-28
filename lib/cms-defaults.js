import "server-only";

import {
  education,
  experience,
  navigation,
  projects,
  siteConfig,
  skills,
  techStack,
} from "@/lib/data";
import { projectsDetail } from "@/lib/projects-data";
import { skillCategories, skillsWithProvenance } from "@/lib/skillsData";
import { pageContentDefaults, themeDefaults } from "@/lib/cms-shared";

export const cmsDefinitions = [
  {
    key: "siteConfig",
    label: "Site identity",
    section: "global",
    description: "Name, biography, contact details, social links, and footer text.",
    contentType: "object",
    previewPath: "/",
    defaultContent: siteConfig,
  },
  {
    key: "pageContent",
    label: "Page copy & SEO",
    section: "pages",
    description: "Headings, calls to action, helper text, marquee copy, and site metadata.",
    contentType: "object",
    previewPath: "/",
    defaultContent: pageContentDefaults,
  },
  {
    key: "theme",
    label: "Theme",
    section: "global",
    description: "The core colors used across the public site.",
    contentType: "theme",
    previewPath: "/",
    defaultContent: themeDefaults,
  },
  {
    key: "navigation",
    label: "Navigation",
    section: "global",
    description: "Desktop and mobile navigation labels, icons, order, and links.",
    contentType: "collection",
    previewPath: "/",
    itemLabel: "label",
    defaultContent: navigation,
  },
  {
    key: "projects",
    label: "Project cards",
    section: "portfolio",
    description: "Project index cards, categories, links, images, and technology tags.",
    contentType: "collection",
    previewPath: "/projects",
    itemLabel: "title",
    defaultContent: projects,
  },
  {
    key: "projectDetails",
    label: "Project case studies",
    section: "portfolio",
    description: "Every field used by the full project showcase pages.",
    contentType: "collection",
    previewPath: "/projects/arbiter",
    itemLabel: "title",
    defaultContent: projectsDetail,
  },
  {
    key: "experience",
    label: "Experience",
    section: "career",
    description: "Professional timeline entries shown on Home and About.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "company",
    defaultContent: experience,
  },
  {
    key: "education",
    label: "Education",
    section: "career",
    description: "Education timeline entries shown on About.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "institution",
    defaultContent: education,
  },
  {
    key: "skills",
    label: "Skill summary",
    section: "skills",
    description: "Compact skill levels used by integrations and the assistant.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "name",
    defaultContent: skills,
  },
  {
    key: "skillsWithProvenance",
    label: "Detailed skills",
    section: "skills",
    description: "Interactive skills with evidence, categories, ecosystems, and links.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "name",
    defaultContent: skillsWithProvenance,
  },
  {
    key: "skillCategories",
    label: "Skill categories",
    section: "skills",
    description: "Filters used by the About page skill explorer.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "label",
    defaultContent: skillCategories,
  },
  {
    key: "techStack",
    label: "Technology stack",
    section: "skills",
    description: "Core technology list and Material Symbol icons.",
    contentType: "collection",
    previewPath: "/about",
    itemLabel: "name",
    defaultContent: techStack,
  },
];

export const cmsDefaults = Object.fromEntries(
  cmsDefinitions.map((definition) => [definition.key, definition.defaultContent]),
);

export function getCmsDefinition(key) {
  return cmsDefinitions.find((definition) => definition.key === key);
}

export function getDefaultCmsEntries() {
  return cmsDefinitions.map((definition, sortOrder) => ({
    key: definition.key,
    label: definition.label,
    section: definition.section,
    description: definition.description,
    contentType: definition.contentType,
    previewPath: definition.previewPath,
    itemLabel: definition.itemLabel,
    sortOrder,
    draftContent: structuredClone(definition.defaultContent),
    publishedContent: null,
    status: "local",
    version: 0,
    updatedAt: null,
    publishedAt: null,
  }));
}

