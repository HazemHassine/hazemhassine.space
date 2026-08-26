import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a clean filename to avoid spaces and special characters
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${originalName}`;
    const isDev = process.env.NODE_ENV === 'development';
    const publicPath = `/images/blog/${fileName}`;
    
    if (isDev) {
      // Local development: Write to file system
      const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'blog');
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }
      
      const filePath = path.join(uploadDirectory, fileName);
      fs.writeFileSync(filePath, buffer);
      
      return NextResponse.json({ success: true, url: publicPath });
    } else {
      // Production on Vercel: Use GitHub API to commit changes
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'GitHub credentials missing' }, { status: 500 });
      }

      const owner = process.env.GITHUB_OWNER || 'HazemHassine';
      const repo = process.env.GITHUB_REPO || 'hazemhassine.space';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const filePath = `public/images/blog/${fileName}`;
      
      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload image ${fileName} via Admin Dashboard`,
          content: buffer.toString('base64'),
          branch: branch
        })
      });

      if (!putRes.ok) {
        const errorData = await putRes.json();
        console.error('GitHub API Error:', errorData);
        return NextResponse.json({ error: 'Failed to push image to GitHub' }, { status: 500 });
      }

      // Important: In production on Vercel, the image is pushed to GitHub, 
      // but Vercel caches public assets. It might take a rebuild for the image 
      // to be served via the static /images/blog/ path if it wasn't there at build time.
      // However, we return the URL so the editor can insert it.
      return NextResponse.json({ success: true, url: publicPath });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
