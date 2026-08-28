import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';

async function handleDelete(request) {
  try {
    let slug;
    
    if (request.method === 'POST' || request.method === 'DELETE') {
      try {
        const body = await request.json();
        slug = body?.slug;
      } catch {
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

    const cleanSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    // Delete from Supabase
    const { error: dbError } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('slug', cleanSlug);

    if (dbError) {
      console.error('Supabase delete error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Also remove local file in development if it exists
    if (process.env.NODE_ENV === 'development') {
      try {
        const filePath = path.join(process.cwd(), 'content', 'blog', `${cleanSlug}.md`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.warn('Could not unlink local backup file:', fileErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Post deleted from Supabase instantly' });
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
