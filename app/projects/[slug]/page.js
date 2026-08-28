import { notFound } from 'next/navigation';
import { projectsDetail, getAllProjectSlugs, getProjectDetail, getAdjacentProjects } from '@/lib/projects-data';
import ProjectShowcaseView from '@/components/ProjectShowcaseView';

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const project = getProjectDetail(resolvedParams.slug);
  
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

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const project = getProjectDetail(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const adjacent = getAdjacentProjects(project.slug);

  return <ProjectShowcaseView project={project} adjacent={adjacent} />;
}
