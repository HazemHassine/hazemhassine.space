import {
  education,
  experience,
  projects,
  siteConfig,
  skills,
  techStack,
} from '@/lib/data';
import { getAllPosts, getLocalPosts } from '@/lib/markdown';

function formatTimeline(items, organizationKey, titleKey) {
  return items
    .map((item) => [
      `${item.year}: ${item[organizationKey]} — ${item[titleKey]}`,
      `Location: ${item.location}`,
      item.description,
    ].join('\n'))
    .join('\n\n');
}

function buildContextString(posts) {
  return `
PROFILE
Name: ${siteConfig.name}
Role: ${siteConfig.role}
Location: ${siteConfig.location}
Summary: ${siteConfig.bio.join(' ')}
GitHub: ${siteConfig.github}
LinkedIn: ${siteConfig.linkedin}
Contact: Direct visitors to the website's /contact page.

EXPERIENCE
${formatTimeline(experience, 'company', 'role')}

EDUCATION
${formatTimeline(education, 'institution', 'degree')}

SKILLS
${skills.map((skill) => `${skill.name}: ${skill.level}/5`).join('\n')}

TECH STACK
${techStack.map((tech) => tech.name).join(', ')}

PROJECTS
${projects.map((project) => [
    `${project.id}. ${project.title} — ${project.subtitle}`,
    project.description,
    `Technologies: ${project.tech.join(', ')}`,
    `Link: ${project.href}`,
  ].join('\n')).join('\n\n')}

WRITING
${posts.length > 0
    ? posts.map((post) => [
      `${post.title} (${post.date})`,
      post.summary || post.excerpt || 'No summary available.',
      `Link: /blog/${post.slug}`,
    ].join('\n')).join('\n\n')
    : 'No published posts are listed.'}
`.trim();
}

export async function getPortfolioContext() {
  const posts = await getAllPosts();
  return buildContextString(posts || []);
}

export function getStaticPortfolioContext() {
  const posts = getLocalPosts();
  return buildContextString(posts || []);
}
