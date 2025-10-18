import type { APIContext } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(ctx: APIContext) {
  let fields: Record<string, string> = {};
  try {
    const ct = ctx.request.headers.get('content-type') || '';
    if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
      const fd = await ctx.request.formData();
      fd.forEach((v, k) => (fields[k] = String(v)));
    } else {
      fields = await ctx.request.json();
    }
  } catch {
    // ignore
  }

  if (fields['bot-field']) {
    console.log('Honeypot hit');
    return new Response(null, { status: 204 });
  }

  const name = fields.name || 'Unknown';
  const email = fields.email || '';
  const phone = fields.phone || '';
  const company = fields.company || '';
  const service = fields.service || '';
  const employees = fields.employees || '';
  const message = fields.message || '';

  if (!name || !email || !phone) {
    return new Response('Missing required fields', { status: 400 });
  }

  const html = `
    <h2>New Website Lead</h2>
    <ul>
      <li><b>Name:</b> ${name}</li>
      <li><b>Email:</b> ${email}</li>
      <li><b>Phone:</b> ${phone}</li>
      <li><b>Company:</b> ${company}</li>
      <li><b>Service:</b> ${service}</li>
      <li><b>Employees:</b> ${employees}</li>
    </ul>
    <p><b>Message:</b><br>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    const from = import.meta.env.FROM || 'JCS Leads <onboarding@resend.dev>';
    const to = [import.meta.env.TO || 'jcsworld.in@gmail.com'];

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New Lead: ${name} (${service || 'General Inquiry'})`,
      html,
    });
  } catch (err) {
    console.error('Email error:', err);
  }

  return ctx.redirect('/thank-you', 303);
}
