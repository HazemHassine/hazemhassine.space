import { getAllPosts } from '@/lib/markdown';
import { getPublishedCmsData } from '@/lib/cms-server';

export default async function sitemap() {
  const baseUrl = 'https://hazemhassine.space';

  // Static routes
  const routes = ['', '/about', '/projects', '/blog', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic project routes
  const cms = await getPublishedCmsData();
  const projectSlugs = (cms.projectDetails || []).map((project) => project.slug);
  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic blog routes
  const posts = await getAllPosts();
  const blogRoutes = (posts || []).map((post) => {
    // Post dates are free-form display strings; fall back when one does not parse.
    const parsed = new Date(post.updatedAt || post.date || '');
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: (Number.isNaN(parsed.getTime()) ? new Date() : parsed).toISOString(),
    };
  });

  return [...routes, ...projectRoutes, ...blogRoutes];
}
