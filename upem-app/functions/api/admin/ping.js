// GET /api/admin/ping  -> simple check
export function onRequest() {
  return new Response(JSON.stringify({ ok: true, ts: new Date().toISOString() }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
