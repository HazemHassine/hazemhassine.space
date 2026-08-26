import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Since this route is protected by middleware, we can safely return raw file contents.
export async function GET() {
  try {
    const contentDirectory = path.join(process.cwd(), 'content', 'blog');
    
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json({ posts: [] });
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const slug = fileName.replace(/\.md$/, '');
        return {
          slug,
          fileName,
          content: fileContents
        };
      });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
