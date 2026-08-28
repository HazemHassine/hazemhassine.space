import {
  education,
  experience,
  siteConfig,
  techStack,
} from '@/lib/data';
import { projectsDetail } from '@/lib/projects-data';
import { skillsWithProvenance } from '@/lib/skillsData';
import { getAllPosts, getLocalPosts } from '@/lib/markdown';

function formatTimeline(items, organizationKey, titleKey) {
  return items
    .map((item) => [
      `• ${item.year}: ${item[organizationKey]} — ${item[titleKey]} (${item.location})`,
      `  Details: ${item.description}`,
    ].join('\n'))
    .join('\n\n');
}

function formatSkills(skills) {
  return skills
    .map((skill) => {
      const prov = skill.provenance
        ?.map((p) => `    - [${p.badge}] ${p.entity} (${p.role}): ${p.summary}`)
        .join('\n') || '';
      return [
        `• ${skill.name} [${skill.categoryLabel}] - Tag: ${skill.tag}`,
        `  Summary: ${skill.summary}`,
        `  Ecosystem: ${skill.ecosystem?.join(', ')}`,
        `  Real Evidence & Provenance:\n${prov}`,
      ].join('\n');
    })
    .join('\n\n');
}

function formatProjects(projects) {
  return projects
    .map((p) => {
      const stats = p.stats ? p.stats.map((s) => `${s.label}: ${s.value}`).join(' | ') : '';
      const problem = p.problemStatement ? `Problem: ${p.problemStatement.problem}\nSolution: ${p.problemStatement.solution}` : '';
      const capabilities = p.keyCapabilities
        ? p.keyCapabilities.slice(0, 4).map((c) => `    - ${c.title}: ${c.description}`).join('\n')
        : '';
      return [
        `• [${p.id}] ${p.title} — ${p.subtitle} (${p.category})`,
        `  Headline: ${p.headline || p.summary}`,
        `  Summary: ${p.summary}`,
        `  Tech Stack: ${p.techStack?.join(', ')}`,
        `  Links: Showcase: /projects/${p.slug}${p.github ? ` | GitHub: ${p.github}` : ''}${p.liveDemo ? ` | Demo: ${p.liveDemo}` : ''}`,
        stats ? `  Key Stats: ${stats}` : '',
        problem ? `  ${problem}` : '',
        capabilities ? `  Key Capabilities:\n${capabilities}` : '',
      ].filter(Boolean).join('\n');
    })
    .join('\n\n');
}

function buildContextString(posts) {
  return `
AUTHORITATIVE PORTFOLIO DOSSIER FOR MOHAMED HAZEM HASSINE

1. PROFILE & IDENTITY
Name: ${siteConfig.name}
Role: ${siteConfig.role}
Tagline: ${siteConfig.tagline}
Location: ${siteConfig.location}
Bio: ${siteConfig.bio.join(' ')}
Current Focus: Pursuing Master's in Intelligent Interactive Systems at Bielefeld University, Germany with deep focus on Agentic AI, RAG, and developer tools.
GitHub: ${siteConfig.github}
LinkedIn: ${siteConfig.linkedin}
Email: ${siteConfig.email}
CV / Resume: /Hazem_Hassine_CV.pdf
Contact Page: /contact (Direct visitors to use the website's /contact form or email).

2. WORK & RESEARCH EXPERIENCE
${formatTimeline(experience, 'company', 'role')}

Key Accomplishment Highlights:
- SIEMENS (Nuremberg, Germany): Analyzed 400K+ user sessions for Insights Hub Monitor and Industrial AI Inference Server. Reconstructed complex user journeys, identified behavioral friction clusters, and built Python analytical pipelines.
- BASIRA / IMPERIAL COLLEGE LONDON (London, UK): ML Researcher on FedLIMIT project. Focused on privacy-preserving collaborative learning and developed PyTorch deep-learning models in federated environments for medical image classification.
- ISIE (Tunisia): Information System Specialist automating internal data processing pipelines and onboarding/training 100+ staff on digital systems.
- MAKE IT HAPPEN (Tunisia): Web Developer Intern building responsive React interfaces and optimizing JavaScript frontend performance.

3. EDUCATION & ACADEMIC BACKGROUND
${formatTimeline(education, 'institution', 'degree')}
- Bielefeld University (2025 - Present): M.Sc. Intelligent Interactive Systems in Bielefeld, Germany. Focused on AI systems, deep learning, reinforcement learning, autonomous agents, and human-computer interaction.
- University of Passau (2024 - 2025): M.Sc. Computer Science in Passau, Germany. Intelligent technical systems, network architecture, and distributed databases.
- University of Monastir / ISIMM (2020 - 2023): B.Sc. Software Engineering & Information Systems Architecture in Monastir, Tunisia. Graduated with grade 2.4, specializing in Big Data and Artificial Intelligence.

4. SKILLS & VERIFIED PROVENANCE
${formatSkills(skillsWithProvenance)}

5. CORE TECH STACK
${techStack.map((tech) => tech.name).join(', ')}

6. FEATURED PROJECTS (DEEP DIVE)
${formatProjects(projectsDetail)}

7. WRITING & ARTICLES
${posts && posts.length > 0
    ? posts.map((post) => [
      `• "${post.title}" (${post.date})`,
      `  Summary: ${post.summary || post.excerpt || 'Technical article'}`,
      `  Link: /blog/${post.slug}`,
    ].join('\n')).join('\n\n')
    : 'No published posts currently listed.'}

8. NAVIGATION ROUTES
• Home: /
• About & Skills: /about
• Projects Index: /projects
• Project Showcase: /projects/[slug] (e.g. /projects/arbiter, /projects/repotrajectory, /projects/gitaudit, /projects/forma, /projects/gemini-mcp, /projects/rsvp-shift, /projects/portfolio)
• Blog: /blog
• Contact: /contact
• Download CV: /Hazem_Hassine_CV.pdf
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

