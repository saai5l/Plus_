
const DISCORD_CLIENT_ID     = "1453875994988380373";
// ⚠️ تحذير أمني: لا تضع الـ Client Secret هنا مطلقاً
// استخدم Cloudflare Workers Secrets بدلاً من ذلك:
// wrangler secret put DISCORD_CLIENT_SECRET
const DISCORD_CLIENT_SECRET = typeof DISCORD_SECRET !== 'undefined' ? DISCORD_SECRET : "";
const REDIRECT_URI          = "https://saai5l.github.io/Plus_/login.html";

// ===== CORS Headers =====
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export default {
  async fetch(request) {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url    = new URL(request.url);
    const code   = url.searchParams.get("code");
    const redir  = url.searchParams.get("redirect_uri") || REDIRECT_URI;

    if (!code) {
      return new Response(
        JSON.stringify({ error: "missing code" }),
        { status: 400, headers: CORS }
      );
    }

    try {
      // ── Step 1: استبدل الكود بـ access_token ──
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id:     DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type:    "authorization_code",
          code:          code,
          redirect_uri:  redir,
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error("Token error:", err);
        return new Response(
          JSON.stringify({ error: "token_failed", detail: err }),
          { status: 400, headers: CORS }
        );
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // ── Step 2: جيب بيانات المستخدم ──
      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        return new Response(
          JSON.stringify({ error: "user_fetch_failed" }),
          { status: 400, headers: CORS }
        );
      }

      const user = await userRes.json();

      // ── Step 3: رجّع البيانات للموقع ──
      return new Response(
        JSON.stringify({
          id:            user.id,
          username:      user.username,
          global_name:   user.global_name || user.username,
          avatar:        user.avatar,
          email:         user.email || "",
          discriminator: user.discriminator,
        }),
        { status: 200, headers: CORS }
      );

    } catch (err) {
      console.error("Worker error:", err);
      return new Response(
        JSON.stringify({ error: "server_error", detail: err.message }),
        { status: 500, headers: CORS }
      );
    }
  },
};
