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
  const referer = ctx.request.headers.get('referer') || '';
  
  // Allow if:
  // 1. Origin is in allowed list
  // 2. No origin header (same-origin/direct requests) BUT referer is from allowed domain
  // 3. No origin AND no referer (for direct API calls/curl from same domain)
  const isOriginAllowed = origin && ALLOWED_ORIGINS.has(origin);
  const isRefererAllowed = referer && Array.from(ALLOWED_ORIGINS).some(allowed => 
    referer.startsWith(allowed)
  );
  const isSameOrigin = !origin && (!referer || isRefererAllowed);
  
  if (!isOriginAllowed && !isSameOrigin) {
    console.log('Blocked request - Origin:', origin, 'Referer:', referer);
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

  // Validate required fields
  if (!name || !email || !phone) {
    console.log('Missing required fields');
    return new Response('Missing required fields: name, email, phone', { status: 400 });
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

    const res = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New Lead: ${name} (${service || 'General Inquiry'})`,
      html,
    });

    console.log('Resend response:', res);

    if (res.error) {
      console.error('Resend error:', res.error);
    }
  } catch (err) {
    console.error('Resend send error:', err);
  }

  return ctx.redirect('/thank-you', 303);
}
