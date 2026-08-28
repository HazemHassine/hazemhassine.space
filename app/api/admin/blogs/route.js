import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function formatPostWithFrontmatter(row) {
  if (row.content && row.content.trim().startsWith('---')) {
    return row.content;
  }
  return `---
id: "${row.id || '001'}"
title: "${row.title || row.slug}"
date: "${row.date || 'OCTOBER 15, 2026'}"
readTime: "${row.read_time || '5 MIN READ'}"
excerpt: "${(row.excerpt || '').replace(/"/g, '\\"')}"
---

${row.content || ''}`;
}

export async function GET() {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching blogs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedPosts = (posts || []).map((row) => ({
      id: row.id,
      slug: row.slug,
      fileName: `${row.slug}.md`,
      title: row.title,
      date: row.date,
      readTime: row.read_time,
      excerpt: row.excerpt,
      content: formatPostWithFrontmatter(row),
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
