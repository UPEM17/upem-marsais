// POST /api/admin/token  -> retourne un PAT GitHub si le mot de passe est correct
export async function onRequest(context) {
  const req = context.request;
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { password } = await req.json();
    const ok = password && context.env.ADMIN_PASSWORD && password === context.env.ADMIN_PASSWORD;
    if (!ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // on renvoie le token GitHub stocké côté Cloudflare
    if (!context.env.GH_PAT) {
      return new Response(JSON.stringify({ error: "Missing GH_PAT" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ access_token: context.env.GH_PAT, token_type: "bearer", provider: "github" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
