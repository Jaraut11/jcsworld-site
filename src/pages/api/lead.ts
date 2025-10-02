import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const form = await request.formData();
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const phone = String(form.get('phone') || '');
    const company = String(form.get('company') || '');
    const service = String(form.get('service') || '');
    const employees = String(form.get('employees') || '');
    const message = String(form.get('message') || '');
    const botField = String(form.get('bot-field') || '');

    // honeypot
    if (botField) return new Response('ok', { status: 200 });

    // basic validation
    if (!name || !phone) {
      return new Response('Missing required fields', { status: 400 });
    }

    // send email to you
    await resend.emails.send({
      from: 'JCS Website <noreply@jcsworld.in>',
      to: ['jcsworld.in@gmail.com'],
      subject: `New Lead: ${name} (${service || 'General'})`,
      reply_to: email || undefined,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company}`,
        `Service: ${service}`,
        `Employees: ${employees}`,
        `Message: ${message}`,
      ].join('\n'),
    });

    // optional: send an autoresponder to the visitor
    if (email) {
      await resend.emails.send({
        from: 'JCS Team <noreply@jcsworld.in>',
        to: [email],
        subject: 'Thanks! We got your request',
        text: `Hi ${name || ''},\n\nThanks for contacting JCS. Our team will WhatsApp/call you shortly.\n\n— JCS (www.jcsworld.in)`,
      });
    }

    // redirect to thank-you page
    return redirect('/thank-you', 303);
  } catch (err) {
    console.error('Lead API error', err);
    return new Response('Server error', { status: 500 });
  }
};

// helpful for quick checks
export const GET: APIRoute = async () =>
  new Response('OK', { status: 200 });
