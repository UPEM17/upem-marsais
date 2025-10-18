// GET /api/auth/login  → redirige vers GitHub OAuth
export async function onRequest(context) {
  const url = new URL(context.request.url);

  // si Decap envoie ?site_id=..., on le propage pour le callback
  const siteId = url.searchParams.get("site_id") || url.origin;

  const redirectUri = `${url.origin}/api/auth/callback?site_id=${encodeURIComponent(siteId)}`;
  const auth = new URL("https://github.com/login/oauth/authorize");
  auth.searchParams.set("client_id", context.env.GH_CLIENT_ID);
  auth.searchParams.set("redirect_uri", redirectUri);
  auth.searchParams.set("scope", "repo"); // tu peux mettre "repo read:user" si besoin
  auth.searchParams.set("state", Math.random().toString(36).slice(2)); // anti-CSRF basique
  return Response.redirect(auth.toString(), 302);
}
