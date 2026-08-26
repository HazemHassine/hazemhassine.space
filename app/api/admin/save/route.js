import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function generateDataFileContent(data) {
  // Convert JSON object to a string format that mimics our original JS file
  const stringifyArray = (arr) => JSON.stringify(arr, null, 2).replace(/"([^"]+)":/g, '$1:');
  const stringifyObject = (obj) => JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:');

  return `// ============================================================
// Site-wide data — keep all content here for easy customization.
// A future dashboard / AI agent can modify this file to
// dynamically select projects, update experience, etc.
// ============================================================

export const siteConfig = ${stringifyObject(data.siteConfig)};

export const navigation = ${stringifyArray(data.navigation)};

export const experience = ${stringifyArray(data.experience)};

export const projects = ${stringifyArray(data.projects)};

export const skills = ${stringifyArray(data.skills)};

export const techStack = ${stringifyArray(data.techStack)};
`;
}

export async function POST(request) {
  try {
    const data = await request.json();
    const fileContent = generateDataFileContent(data);
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      // Local Development: Write directly to the file system
      const filePath = path.join(process.cwd(), 'lib', 'data.js');
      fs.writeFileSync(filePath, fileContent, 'utf8');
      return NextResponse.json({ success: true, message: 'Saved locally' });
    } else {
      // Production (Vercel): Use GitHub API to commit changes
      const token = process.env.GITHUB_TOKEN;
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;

      if (!token || !owner || !repo) {
        return NextResponse.json(
          { error: 'GitHub credentials missing in environment variables' },
          { status: 500 }
        );
      }

      const filePath = 'lib/data.js';
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

      // 1. Get the current file SHA
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!getRes.ok) {
        throw new Error('Failed to fetch current file from GitHub');
      }

      const fileData = await getRes.json();
      const sha = fileData.sha;

      // 2. Commit the new file
      const encodedContent = Buffer.from(fileContent).toString('base64');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update portfolio content via Admin Dashboard',
          content: encodedContent,
          sha: sha,
        }),
      });

      if (!putRes.ok) {
        throw new Error('Failed to commit to GitHub');
      }

      return NextResponse.json({ success: true, message: 'Saved to GitHub successfully' });
    }
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
