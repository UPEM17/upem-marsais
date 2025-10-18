// GET /api/auth/login  → redirige vers GitHub OAuth
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;
  const auth = new URL("https://github.com/login/oauth/authorize");
  auth.searchParams.set("client_id", context.env.GH_CLIENT_ID);
  auth.searchParams.set("redirect_uri", redirectUri);
  auth.searchParams.set("scope", "repo");
  return Response.redirect(auth.toString(), 302);
}
