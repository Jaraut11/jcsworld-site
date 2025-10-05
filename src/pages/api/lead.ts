import type { APIContext } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Allow your own domain(s) only
const ALLOWED_ORIGINS = new Set([
  'http://localhost:4321',
  'http://localhost:4000',
  'https://www.jcsworld.in',
  'https://jcsworld.in',
]);

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(ctx: APIContext) {
  const origin = ctx.request.headers.get('origin') || '';
  if (!ALLOWED_ORIGINS.has(origin)) {
    return new Response('Cross-site POST form submissions are forbidden', { status: 403 });
  }

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
    // ignore – fields stays empty
  }

  // Simple honeypot
  if (fields['bot-field']) {
    console.log('Honeypot hit, dropping submission.');
    return new Response(null, { status: 204 });
  }

  const name = fields.name || 'Unknown';
  const email = fields.email || '';
  const phone = fields.phone || '';
  const company = fields.company || '';
  const service = fields.service || '';
  const employees = fields.employees || '';
  const message = fields.message || '';

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
    const from = 'JCS Leads <onboarding@resend.dev>'; // safe without domain verification
    const to = ['jcsworld.in@gmail.com'];

    const res = await resend.emails.send({
      from,
      to,
      subject: `New Lead: ${name} (${service || 'Service'})`,
      html,
    });

    console.log('Resend response:', res);
  } catch (err) {
    console.error('Resend send error:', err);
  }

  // Always send the user to thank-you (email can complete asynchronously)
  return ctx.redirect('/thank-you', 303);
}
