// functions/api/admin/token.js
export async function onRequest(context) {
  const req = context.request;

  // Toujours renvoyer du JSON — même en cas de mauvaise méthode
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString().trim();

  // Identifiants fixes
  const FIXED_USER = "admin";
  const FIXED_PASSWORD = "Belier666.";

  // Secret Cloudflare Pages (type "Secret") : GH_PAT
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
