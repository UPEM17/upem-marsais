// POST /api/push/subscribe  (body = subscription JSON)
export async function onRequestPost({ env, request }) {
  if (!env.PUSH_SUBS) return json({ error: "KV binding PUSH_SUBS manquant" }, 500);
  const sub = await request.json();
  if (!sub || !sub.endpoint) return json({ error: "subscription invalide" }, 400);
  const key = btoa(sub.endpoint).slice(0, 64);
  await env.PUSH_SUBS.put(key, JSON.stringify(sub));
  return json({ ok: true });
}
function json(data, status=200){ return new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json'}}); }
