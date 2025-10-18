// POST /api/admin/token  → renvoie le PAT GitHub si le mot de passe fourni est correct
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

  // ⚠️ Mot de passe attendu côté client (entré dans le formulaire)
  const password = (body.password || "").toString().trim();

  // ⚠️ TON MOT DE PASSE FIXE (NE RIEN CHANGER ICI SAUF LA VALEUR)
  const FIXED_PASSWORD = "Belier666.";

  // ⚠️ Ton token GitHub doit être défini en variable Cloudflare: GH_PAT
  const GH_PAT = context.env.GH_PAT;

  if (!GH_PAT) {
    return new Response(JSON.stringify({ error: "Missing GH_PAT" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (password !== FIXED_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // ✅ Succès : renvoie le token GitHub pour Decap CMS
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
