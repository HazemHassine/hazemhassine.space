import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { slug, content } = await request.json();
    
    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing slug or content' }, { status: 400 });
    }

    const fileName = `${slug}.md`;
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      // Local development: Write to file system
      const contentDirectory = path.join(process.cwd(), 'content', 'blog');
      if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true });
      }
      const filePath = path.join(contentDirectory, fileName);
      fs.writeFileSync(filePath, content, 'utf8');
      return NextResponse.json({ success: true, message: 'Saved locally' });
    } else {
      // Production on Vercel: Use GitHub API to commit changes
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'GitHub credentials missing in environment variables' }, { status: 500 });
      }

      // We need to determine the GitHub owner, repo, and branch. 
      // For now, we will hardcode this based on standard Vercel environments, 
      // or require them to be set in env vars.
      const owner = process.env.GITHUB_OWNER || 'HazemHassine';
      const repo = process.env.GITHUB_REPO || 'hazemhassine.space';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const filePath = `content/blog/${fileName}`;

      // 1. Get the current file (if it exists) to get its SHA for updating
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      let sha;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2. Commit the updated/new file
      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update blog post ${fileName} via Admin Dashboard`,
          content: Buffer.from(content).toString('base64'),
          branch: branch,
          sha: sha // Included if updating an existing file
        })
      });

      if (!putRes.ok) {
        const errorData = await putRes.json();
        console.error('GitHub API Error:', errorData);
        return NextResponse.json({ error: 'Failed to push to GitHub' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Committed to GitHub successfully. Vercel will rebuild.' });
    }
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
