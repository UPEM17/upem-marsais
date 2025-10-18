// GET /api/push/vapidPublic  -> expose la clé publique
export async function onRequest({ env }) {
  const key = env.VAPID_PUBLIC_KEY;
  if (!key) return new Response(JSON.stringify({ error: "VAPID_PUBLIC_KEY manquant"}), { status:500, headers:{'content-type':'application/json'}});
  return new Response(JSON.stringify({ key }), { headers:{'content-type':'application/json'}});
}
