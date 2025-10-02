import type { APIContext } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM_OK = 'onboarding@resend.dev'; // change to noreply@jcsworld.in after Resend domain is verified
const TO = 'jcsworld.in@gmail.com';

function textField(v: unknown) {
  return (typeof v === 'string' ? v.trim() : '');
}

export async function GET() {
  return new Response('OK', { status: 200, headers: { 'content-type': 'text/plain;charset=UTF-8' } });
}

export async function POST({ request }: APIContext) {
  try {
    const ct = request.headers.get('content-type') || '';
    let fields: Record<string, string> = {};

    if (ct.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      fields = Object.fromEntries(Object.entries(body).map(([k,v]) => [k, textField(v)]));
    } else {
      const form = await request.formData();
      fields = Object.fromEntries([...form].map(([k, v]) => [k, textField(v)]));
    }

    // Do NOT block on honeypot right now; only log
    if (fields['bot-field']) {
      console.warn('Honeypot filled:', fields['bot-field']);
    }

    const name = fields.name || 'Website Lead';
    const email = fields.email || '';
    const phone = fields.phone || '';
    const company = fields.company || '';
    const service = fields.service || '';
    const employees = fields.employees || '';
    const message = fields.message || '';

    const subject = `New Lead: ${name}${company ? ` (${company})` : ''}`;
    const bodyText =
`Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Service: ${service}
Employees: ${employees}

Message:
${message}
`;

    await resend.emails.send({
      from: FROM_OK,
      to: TO,
      subject,
      reply_to: email || undefined,
      text: bodyText,
    });

    return new Response(null, { status: 303, headers: { Location: '/thank-you' } });
  } catch (err) {
    console.error('Lead API error:', err);
    return new Response('Internal Error', { status: 500 });
  }
}
