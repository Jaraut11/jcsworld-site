set -euo pipefail
mkdir -p src/pages/api
cp src/pages/api/lead.ts src/pages/api/lead.ts.bak.$(date +%s) 2>/dev/null || true
cat > src/pages/api/lead.ts <<'TS'
import type { APIRoute } from 'astro';

const ALLOWED_ORIGINS = new Set([
  'https://www.jcsworld.in',
  'https://jcsworld.in',
  'http://localhost:4321',
]);

// --- helpers ---------------------------------------------------------------
const sanitize = (s: string) => (s ?? '')
  .toString()
  .replace(/^"(.*)"$/, '$1')
  .replace(/\\n/g, '\n')
  .trim();

const log    = (...args: any[]) => console.log('[JCS lead]', ...args);
const logErr = (...args: any[]) => console.error('[JCS lead]', ...args);

const pick = (form: FormData, key: string, max = 200) =>
  String(form.get(key) ?? '').toString().trim().slice(0, max);

// --------------------------------------------------------------------------
export const POST: APIRoute = async ({ request }) => {
  try {
    // 1) Content-Type gate
    const ct = request.headers.get('content-type') || '';
    if (!ct.toLowerCase().includes('application/x-www-form-urlencoded')) {
      return new Response('Unsupported Media Type', { status: 415 });
    }

    // 2) CSRF / same-origin
    const origin = request.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return new Response('Forbidden (CSRF)', { status: 403 });
    }

    // 3) Parse form
    const form = await request.formData();

    // 4) Honeypot
    const botField = String(form.get('bot-field') || '').trim();
    if (botField) return new Response('Forbidden (bot)', { status: 403 });

    // 5) Extract fields (bounded)
    const name      = pick(form, 'name', 120);
    const email     = pick(form, 'email', 200);
    const phone     = pick(form, 'phone', 40);
    const company   = pick(form, 'company', 120);
    const service   = pick(form, 'service', 120);
    const employees = pick(form, 'employees', 40);
    const message   = pick(form, 'message', 2000);

    // 6) Caller IP (best-effort)
    const ip = (request.headers.get('x-forwarded-for') || '')
      .split(',')[0]
      .trim() || 'unknown';

    log('start', { name, email, phone, ip });

    // 7) Env & email payload
    const RESEND_API_KEY = sanitize(process.env.RESEND_API_KEY || '');
    const FROM = sanitize(process.env.FROM || 'JCS <noreply@jcsworld.in>');
    const TO   = sanitize(process.env.TO   || 'jcsworld.in@gmail.com');

    if (RESEND_API_KEY) {
      try {
        const payload = {
          from: FROM,
          to: [TO],
          reply_to: email || undefined,
          subject: `[JCS Lead] ${name || '(no name)'} — ${service || 'Service'}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Company: ${company}`,
            `Service: ${service}`,
            `Employees: ${employees}`,
            `IP: ${ip}`,
            '',
            message,
          ].join('\n'),
        };

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.text().catch(() => '(no body)');
          logErr('Resend error', res.status, res.statusText, body);
        } else {
          log('Resend ok', res.status);
        }
      } catch (err: any) {
        logErr('Resend exception', err?.message || String(err));
      }
    } else {
      logErr('RESEND_API_KEY missing; skipping email send');
    }

    // 8) Always redirect 303 to thank-you (non-blocking UX)
    const base = new URL('/', request.url).origin;
    const url = new URL('/thank-you', base);
    url.searchParams.set('name', name);
    url.searchParams.set('email', email);
    url.searchParams.set('phone', phone);
    return Response.redirect(url.toString(), 303);
  } catch (err: any) {
    logErr('Unhandled error', err?.message || String(err));
    try {
      const base = new URL('/', request.url).origin;
      const url = new URL('/thank-you', base);
      return Response.redirect(url.toString(), 303);
    } catch {
      return new Response('See /thank-you', { status: 303, headers: { location: '/thank-you' } });
    }
  }
};
TS
vercel deploy --prod
