// File: /api/oauth/callback.js

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    // Production: do not expose tokens in UI
    // You can store tokenData in DB or send it to Botpress webhook

    return res.status(200).json({ success: true, token: tokenData });
  } catch (err) {
    return res.status(500).json({ error: "Token exchange failed", details: err.message });
  }
}
