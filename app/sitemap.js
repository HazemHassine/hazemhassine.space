import { getAllPosts } from '@/lib/markdown';
import { getAllProjectSlugs } from '@/lib/projects-data';

export default async function sitemap() {
  const baseUrl = 'https://hazemhassine.space';

  // Static routes
  const routes = ['', '/about', '/projects', '/blog', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic project routes
  const projectSlugs = getAllProjectSlugs();
  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic blog routes
  const posts = await getAllPosts();
  const blogRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
  }));

  return [...routes, ...projectRoutes, ...blogRoutes];
}
