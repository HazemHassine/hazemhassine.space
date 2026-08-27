import { getAllPosts } from '@/lib/markdown';

export default async function sitemap() {
  const baseUrl = 'https://hazemhassine.space';

  // Static routes
  const routes = ['', '/about', '/work', '/blog', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic blog routes
  const posts = getAllPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
  }));

  return [...routes, ...blogRoutes];
}
