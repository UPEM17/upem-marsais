// POST /api/admin/token  → retourne le PAT GitHub si les identifiants sont corrects
export async function onRequest(context) {
  const req = context.request;

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString().trim();

  // ✅ Identifiants fixes (modifie si tu veux)
  const FIXED_USER = "admin";
  const FIXED_PASSWORD = "Belier666.";

  // ✅ Ton token GitHub (à mettre en secret Cloudflare: GH_PAT)
  const GH_PAT = context.env.GH_PAT;

  if (!GH_PAT) {
    return new Response(JSON.stringify({ error: "Missing GH_PAT" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (username !== FIXED_USER || password !== FIXED_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // OK → renvoyer le token pour Decap CMS
  return new Response(
    JSON.stringify({
      access_token: GH_PAT,
      token_type: "bearer",
      provider: "github"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
