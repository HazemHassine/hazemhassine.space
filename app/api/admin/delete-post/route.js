import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function handleDelete(request) {
  try {
    let slug;
    
    // Support parsing from JSON body or URL search parameters
    if (request.method === 'POST' || request.method === 'DELETE') {
      try {
        const body = await request.json();
        slug = body?.slug;
      } catch {
        // If JSON parsing fails, fallback to searchParams
        const { searchParams } = new URL(request.url);
        slug = searchParams.get('slug');
      }
    } else {
      const { searchParams } = new URL(request.url);
      slug = searchParams.get('slug');
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    // Sanitize slug to prevent path traversal
    const cleanSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const fileName = `${cleanSlug}.md`;
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      // Local development: Delete from file system
      const contentDirectory = path.join(process.cwd(), 'content', 'blog');
      const filePath = path.join(contentDirectory, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return NextResponse.json({ success: true, message: 'Deleted locally' });
      } else {
        return NextResponse.json({ error: 'Post file not found' }, { status: 404 });
      }
    } else {
      // Production on Vercel: Use GitHub API to delete file
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'GitHub credentials missing in environment variables' }, { status: 500 });
      }

      const owner = process.env.GITHUB_OWNER || 'HazemHassine';
      const repo = process.env.GITHUB_REPO || 'hazemhassine.space';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const filePath = `content/blog/${fileName}`;

      // 1. Get the current file to get its SHA for deletion
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!getRes.ok) {
        if (getRes.status === 404) {
          return NextResponse.json({ error: 'Post not found on GitHub repository' }, { status: 404 });
        }
        const errorData = await getRes.json().catch(() => ({}));
        console.error('GitHub API Get File Error:', errorData);
        return NextResponse.json({ error: 'Failed to retrieve file from GitHub' }, { status: 500 });
      }

      const fileData = await getRes.json();
      const sha = fileData.sha;

      // 2. Send DELETE request to GitHub API
      const deleteUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const deleteRes = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete blog post ${fileName} via Admin Dashboard`,
          sha: sha,
          branch: branch
        })
      });

      if (!deleteRes.ok) {
        const errorData = await deleteRes.json().catch(() => ({}));
        console.error('GitHub API Delete Error:', errorData);
        return NextResponse.json({ error: 'Failed to delete file on GitHub' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Deleted from GitHub successfully. Vercel will rebuild.' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  return handleDelete(request);
}

export async function DELETE(request) {
  return handleDelete(request);
}
