import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabaseAdmin } from '@/lib/supabase';

function calculateReadTime(content) {
  const text = content || '';
  const wordCount = text.trim().split(/\s+/).length;
  const time = Math.max(1, Math.ceil(wordCount / 200));
  return `${time} MIN READ`;
}

export async function POST(request) {
  try {
    const { slug, content } = await request.json();
    
    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing slug or content' }, { status: 400 });
    }

    const cleanSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    // Parse frontmatter
    const parsed = matter(content);
    const bodyContent = parsed.content.trim();
    
    // Check if post already exists to preserve existing id
    const { data: existingPost } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle();

    const postId = parsed.data.id || existingPost?.id || Date.now().toString();
    const title = parsed.data.title || cleanSlug;
    const date = parsed.data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
    const readTime = parsed.data.readTime || calculateReadTime(bodyContent);
    const excerpt = parsed.data.excerpt || parsed.data.summary || parsed.data.description || '';

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('posts')
      .upsert({
        id: String(postId),
        slug: cleanSlug,
        title,
        date,
        read_time: readTime,
        excerpt,
        content: bodyContent,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

    if (dbError) {
      console.error('Supabase save error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Also update local file in development for offline/local backup
    if (process.env.NODE_ENV === 'development') {
      try {
        const contentDirectory = path.join(process.cwd(), 'content', 'blog');
        if (!fs.existsSync(contentDirectory)) {
          fs.mkdirSync(contentDirectory, { recursive: true });
        }
        const filePath = path.join(contentDirectory, `${cleanSlug}.md`);
        fs.writeFileSync(filePath, content, 'utf8');
      } catch (fileErr) {
        console.warn('Could not write local backup file:', fileErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Saved to Supabase instantly' });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
