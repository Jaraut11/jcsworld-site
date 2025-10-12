import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
};

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204 });
