import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, handle, platform } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'XClear <onboarding@resend.dev>',
      to: email,
      subject: `Alert set for ${handle ? `@${handle}` : 'your account'}`,
      html: `
        <div style="font-family:sans-serif">
          <h2>You're in! ✅</h2>
          <p>We'll email you if <b>${handle ? `@${handle}` : 'your account'}</b> gets flagged on <b>${platform || 'X'}</b>.</p>
          <p style="color:#666">You can unsubscribe anytime.</p>
          <p>— XClear</p>
        </div>
      `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
