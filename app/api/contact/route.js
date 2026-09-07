import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';
import { getPublishedCmsData } from '@/lib/cms-server';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
    
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const { error: storageError } = await supabaseAdmin.from('contact_messages').insert({
        name,
        email,
        message,
      });
      if (storageError) console.warn('Could not store contact message:', storageError.message);
    }

    const cms = await getPublishedCmsData();
    const destinationEmail = cms.siteConfig?.email || 'hazemhassine.edu@gmail.com';

    // NOTE: onboarding@resend.dev is the default sandbox address.
    // It only allows sending to the email address registered on your Resend account.
    // Once you verify your domain in Resend, change this to something like 'contact@hazemhassine.space'
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [destinationEmail],
      subject: `New Portfolio Message from ${name.replace(/[\r\n]/g, ' ')}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
