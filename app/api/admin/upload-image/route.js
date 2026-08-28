import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestedBucket = formData.get('bucket');
    const bucket = requestedBucket === 'cms-media' ? 'cms-media' : 'blog-images';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a clean filename to avoid spaces and special characters
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${originalName}`;
    const contentType = file.type || 'image/jpeg';

    if (!contentType.startsWith('image/') && contentType !== 'application/pdf') {
      return NextResponse.json({ error: 'Only images and PDF files are allowed' }, { status: 400 });
    }

    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be smaller than 10 MB' }, { status: 400 });
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase image upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the instant public URL from Supabase Storage
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
