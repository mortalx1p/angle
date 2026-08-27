// Real data via Reddit's public JSON endpoints — no key required, read-only, no ToS issue.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sub = (searchParams.get("sub") || "all").replace(/[^a-zA-Z0-9_]/g, "");

    const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=15`, {
      headers: { "User-Agent": "angle-engine-app/1.0 (by /u/anonymous)" },
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
