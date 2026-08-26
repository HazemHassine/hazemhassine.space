import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

// Helper to ensure the directory exists
function ensureDirectory() {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }
}

// Calculate read time automatically
function calculateReadTime(content) {
  const text = content || '';
  const wordCount = text.trim().split(/\s+/).length;
  const time = Math.max(1, Math.ceil(wordCount / 200));
  return `${time} MIN READ`;
}

export function getAllPosts() {
  ensureDirectory();
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      
      const summary = matterResult.data.summary || matterResult.data.description || matterResult.data.excerpt || '';
      const readTime = calculateReadTime(matterResult.content);

      return {
        slug,
        ...matterResult.data,
        summary,
        readTime
      };
    });

  // Sort posts by date descending
  return allPostsData.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

export function getPostBySlug(slug) {
  ensureDirectory();
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const summary = matterResult.data.summary || matterResult.data.description || matterResult.data.excerpt || '';
  const readTime = calculateReadTime(matterResult.content);

  return {
    slug,
    content: matterResult.content,
    ...matterResult.data,
    summary,
    readTime
  };
}
