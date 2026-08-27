// Reddit deprecated unauthenticated .json access in May 2026 — it now 403s
// (or silently returns an HTML block page) for exactly this kind of
// server-to-server request, especially from cloud/datacenter IPs like Vercel's.
// This uses Reddit's official OAuth client-credentials flow instead, which is
// still free for non-commercial use (~100 requests/min).
//
// Setup: reddit.com/prefs/apps -> "create app" -> type "script" ->
// copy the client ID (under the app name) and the secret into
// REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in Vercel.

let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) return cachedToken;

  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET is not set");
  }

  const basicAuth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "angle-engine-app/1.0",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error("Reddit auth failed: " + JSON.stringify(data));
  }
  cachedToken = data.access_token;
  cachedTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sub = (searchParams.get("sub") || "all").replace(/[^a-zA-Z0-9_]/g, "");

    const token = await getAccessToken();

    const res = await fetch(`https://oauth.reddit.com/r/${sub}/hot?limit=15`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "angle-engine-app/1.0",
      },
    });
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data }, { status: res.status });
    }

    const items = (data?.data?.children || [])
      .filter((c) => !c.data.stickied)
      .map((c) => {
        const p = c.data;
        return {
          id: "rd_" + p.id,
          platform: "reddit",
          topic: p.title,
          creator: "u/" + p.author,
          hookText: p.title,
          description: p.selftext ? p.selftext.slice(0, 400) : "",
          views: null,
          likes: Number(p.ups || 0),
          comments: Number(p.num_comments || 0),
          shares: null,
          posted: p.created_utc * 1000,
          thumbnail: (p.thumbnail && p.thumbnail.startsWith("http")) ? p.thumbnail : null,
          url: "https://www.reddit.com" + p.permalink,
          type: null,
          trigger: null,
          replicability: null,
          cpaAdaptability: null,
          velocity: null,
        };
      });

    return Response.json({ items });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
