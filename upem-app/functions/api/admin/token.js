// POST /api/admin/token  -> retourne le PAT GitHub si identifiants valides
export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Bad Request" }, 400);
  }

  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString().trim();

  // Identifiants fixes
  const FIXED_USER = "admin";
  const FIXED_PASSWORD = "Belier666.";

  // Secret Cloudflare Pages (Settings → Variables and Secrets)
  const GH_PAT = context.env.GH_PAT;
  if (!GH_PAT) return json({ error: "Missing GH_PAT" }, 500);

  if (username !== FIXED_USER || password !== FIXED_PASSWORD) {
    return json({ error: "Unauthorized" }, 401);
  }

  return json({
    access_token: GH_PAT,
    token_type: "bearer",
    provider: "github"
  });
}

// Helpers
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}

// Pour toute autre méthode que POST → 405
export function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  // Si Cloudflare route ici pour une raison X, on délègue à onRequestPost
  return onRequestPost(context);
}
