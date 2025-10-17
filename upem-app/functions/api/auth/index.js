/**
 * Décap CMS OAuth proxy pour GitHub – Cloudflare Pages Functions
 * Routes: /api/auth/login, /api/auth/callback
 */
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const { env } = context; // GH_CLIENT_ID, GH_CLIENT_SECRET
  const redirectUri = `${url.origin}/api/auth/callback`;
  const scope = "repo";

  if (url.pathname.endsWith("/login")) {
    const auth = new URL("https://github.com/login/oauth/authorize");
    auth.searchParams.set("client_id", env.GH_CLIENT_ID);
    auth.searchParams.set("redirect_uri", redirectUri);
    auth.searchParams.set("scope", scope);
    return Response.redirect(auth.toString(), 302);
  }

  if (url.pathname.endsWith("/callback")) {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new URLSearchParams({
        client_id: env.GH_CLIENT_ID,
        client_secret: env.GH_CLIENT_SECRET,
        code
      })
    });
    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) {
      return new Response(JSON.stringify(tokenJson), { status: 400 });
    }

    const adminUrl = new URL(`${url.origin}/admin/`);
    adminUrl.hash = `#access_token=${tokenJson.access_token}&token_type=bearer&provider=github`;
    return Response.redirect(adminUrl.toString(), 302);
  }

  return new Response("Not found", { status: 404 });
}
