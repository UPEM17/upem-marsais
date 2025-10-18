// GET /api/auth/callback  → échange le code contre un token puis renvoie vers /admin/
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new URLSearchParams({
      client_id: context.env.GH_CLIENT_ID,
      client_secret: context.env.GH_CLIENT_SECRET,
      code
    })
  });
  const data = await res.json();

  if (!data.access_token) {
    return new Response(JSON.stringify(data), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // si site_id a été fourni par Decap, on l'utilise comme base pour /admin/
  const siteId = url.searchParams.get("site_id");
  const base = siteId ? `https://${siteId}` : url.origin;

  // format attendu par Decap : /admin/#access_token=...&token_type=bearer&provider=github
  const admin = new URL(`${base}/admin/`);
  admin.hash = `access_token=${encodeURIComponent(data.access_token)}&token_type=bearer&provider=github`;
  return Response.redirect(admin.toString(), 302);
}
