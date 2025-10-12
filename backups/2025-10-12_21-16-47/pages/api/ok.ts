// /api/ok : strict GET-only health check
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: true, route: '/api/ok', ts: Date.now() }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });

export const ALL: APIRoute = async ({ request }) => {
  if (request.method === 'GET') return undefined;
  return new Response('Method Not Allowed', { status: 405 });
};
