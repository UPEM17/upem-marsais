// =====================================
// 🔐 UPEM Admin Token - Version simplifiée
// =====================================
// Cette fonction vérifie un mot de passe fixe ("Belier666.")
// et renvoie un token GitHub (GH_PAT) stocké dans Cloudflare Pages.
//
// ➜ URL : https://upem17.pages.dev/api/admin/token
// =====================================

export async function onRequest(context) {
  const req = context.request;

  // Vérifie la méthode HTTP
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Lecture du corps JSON { password: "xxx" }
  let body = {};
  try {
    body = await req.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const password = (body.password || "").toString().trim();

  // ⚙️ Configuration interne
  const FIXED_PASSWORD = "Belier666."; // 🔒 ton mot de passe
  const GH_PAT = context.env.GH_PAT;   // 🔑 ton token GitHub stocké côté Cloudflare

  // Vérifie la présence du token GitHub
  if (!GH_PAT) {
    return new Response(JSON.stringify({ error: "Missing GH_PAT" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Vérifie le mot de passe
  if (password !== FIXED_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // ✅ Succès : renvoie le token GitHub à Decap CMS
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
