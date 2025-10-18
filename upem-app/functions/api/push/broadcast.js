// POST /api/push/broadcast  (body: {title, body, url})
// Nécessite: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_SUBS (KV), ADMIN_PUSH_KEY (Bearer)
import { generateVapidHeaders } from './vapid.mjs';

export async function onRequestPost({ env, request }) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== env.ADMIN_PUSH_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!env.PUSH_SUBS) return json({ error: "KV PUSH_SUBS manquant"}, 500);
  const { title, body, url } = await request.json();

  const list = await env.PUSH_SUBS.list();
  let sent = 0;
  for (const k of list.keys) {
    const sub = JSON.parse(await env.PUSH_SUBS.get(k.name));
    try {
      const headers = generateVapidHeaders(sub.endpoint, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY, 'mailto:contact@example.com');
      await fetch(sub.endpoint, {
        method: 'POST',
        headers: {
          'TTL': '60',
          'Content-Type': 'application/octet-stream',
          ...headers
        },
        body: JSON.stringify({ title, body, url })
      });
      sent++;
    } catch(e) {
      // silencieux
    }
  }
  return json({ ok: true, sent });
}
function json(data, status=200){ return new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json'}}); }
