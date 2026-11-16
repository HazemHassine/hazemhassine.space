import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isSupabaseConfigured, shouldThrowOnReadError, supabase } from '@/lib/supabase';

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

function mapPostRow(row) {
  return {
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
  };
}

async function runPostQuery(query) {
  try {
    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

// Supabase is authoritative whenever it answers: an empty result means "no
// published post", so drafts and deleted posts are never served from the local
// Markdown copies. Local files are used only when Supabase is not configured or
// the read itself fails.
export async function getAllPosts({ strict = false } = {}) {
  if (!isSupabaseConfigured) {
    return getLocalPosts();
  }

  const { data, error } = await runPostQuery(
    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
  );

  if (!error) return (data || []).map(mapPostRow);

  if (shouldThrowOnReadError(strict)) {
    throw new Error(`Could not load posts from Supabase: ${error.message}`);
  }
  console.error('Error fetching posts from Supabase, using local fallback:', error);
  return getLocalPosts();
}

export async function getPostBySlug(slug, { strict = false } = {}) {
  if (!isSupabaseConfigured) {
    return getLocalPostBySlug(slug);
  }

  const { data, error } = await runPostQuery(
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
  );

  if (!error) return data ? mapPostRow(data) : null;

  if (shouldThrowOnReadError(strict)) {
    throw new Error(`Could not load post ${slug} from Supabase: ${error.message}`);
  }
  console.error(`Error fetching post ${slug} from Supabase, using local fallback:`, error);
  return getLocalPostBySlug(slug);
}
