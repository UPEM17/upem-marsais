// functions/api/admin/token.js

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const req = context.request;

  // 1) Préflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // 2) Uniquement POST pour obtenir le token
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // 3) Lecture du body (si vide, on met un objet vide)
  let body = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString().trim();

  // Identifiants fixes
  const FIXED_USER = "admin";
  const FIXED_PASSWORD = "Belier666.";

  // Secret Cloudflare (Pages -> Settings -> Environment variables)
  const GH_PAT = context.env.GH_PAT;

  if (!GH_PAT) {
    return new Response(JSON.stringify({ error: "Missing GH_PAT" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  if (username !== FIXED_USER || password !== FIXED_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Ok → renvoie un token “bearer” pour Decap (backend GitHub)
  return new Response(
    JSON.stringify({
      access_token: GH_PAT,
      token_type: "bearer",
      provider: "github",
    }),
    {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
