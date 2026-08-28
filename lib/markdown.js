import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabase } from '@/lib/supabase';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

// Helper to ensure the local directory exists
function ensureDirectory() {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }
}

// Calculate read time automatically
export function calculateReadTime(content) {
  const text = content || '';
  const wordCount = text.trim().split(/\s+/).length;
  const time = Math.max(1, Math.ceil(wordCount / 200));
  return `${time} MIN READ`;
}

// Fallback to local files if Supabase is not reached
export function getLocalPosts() {
  ensureDirectory();
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);
      const summary = matterResult.data.summary || matterResult.data.description || matterResult.data.excerpt || '';
      const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

      return {
        id: matterResult.data.id,
        slug,
        title: matterResult.data.title || slug,
        date: matterResult.data.date || 'OCTOBER 15, 2026',
        readTime,
        summary,
        excerpt: summary,
        content: matterResult.content,
        ...matterResult.data,
      };
    });

  return allPostsData.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

export function getLocalPostBySlug(slug) {
  ensureDirectory();
  const fullPath = path.join(contentDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const summary = matterResult.data.summary || matterResult.data.description || matterResult.data.excerpt || '';
  const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

  return {
    id: matterResult.data.id,
    slug,
    title: matterResult.data.title || slug,
    date: matterResult.data.date || 'OCTOBER 15, 2026',
    readTime,
    summary,
    excerpt: summary,
    content: matterResult.content,
    ...matterResult.data,
  };
}

// Primary Supabase fetch with fallback
export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        date: row.date,
        readTime: row.read_time || calculateReadTime(row.content),
        summary: row.excerpt || '',
        excerpt: row.excerpt || '',
        content: row.content,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error('Error fetching posts from Supabase, using local fallback:', err);
  }

  return getLocalPosts();
}

export async function getPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        date: data.date,
        readTime: data.read_time || calculateReadTime(data.content),
        summary: data.excerpt || '',
        excerpt: data.excerpt || '',
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    console.error(`Error fetching post ${slug} from Supabase, using local fallback:`, err);
  }

  return getLocalPostBySlug(slug);
}
