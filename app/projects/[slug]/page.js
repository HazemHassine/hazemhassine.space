import { notFound } from 'next/navigation';
import { projectsDetail, getAllProjectSlugs } from '@/lib/projects-data';
import ProjectShowcaseView from '@/components/ProjectShowcaseView';
import { getPublishedCmsData } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

function findProject(projects, slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return projects.find((project) => project.slug === normalized || project.aliases?.includes(normalized)) || null;
}

function findAdjacent(projects, slug) {
  const index = projects.findIndex((project) => project.slug === slug || project.aliases?.includes(slug));
  if (index === -1 || projects.length === 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : projects.at(-1),
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  };
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const cms = await getPublishedCmsData();
  const project = findProject(cms.projectDetails || projectsDetail, resolvedParams.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | HAZEM HASSINE',
    };
  }

  return {
    title: `${project.title} — ${project.subtitle} | HAZEM HASSINE`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.summary,
      images: project.screenshots?.[0]?.src ? [project.screenshots[0].src] : undefined,
    },
  };
}

export default async function ProjectPage({ params, cmsData } = {}) {
  const resolvedParams = await params;
  const cms = cmsData || await getPublishedCmsData();
  const allProjects = cms.projectDetails || projectsDetail;
  const project = findProject(allProjects, resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const adjacent = findAdjacent(allProjects, project.slug);

  return <ProjectShowcaseView project={project} adjacent={adjacent} />;
}
