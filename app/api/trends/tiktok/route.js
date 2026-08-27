// TikTok has no public API for engagement stats without an approved business
// partnership. The only legitimate, ToS-safe endpoint available to anyone is
// TikTok's official oEmbed, which returns title/author/thumbnail ONLY.
// We deliberately do NOT fabricate views/likes/comments here — those fields
// come back null and the UI must show them as "not available" rather than inventing numbers.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return Response.json({ error: "Missing ?url=" }, { status: 400 });
    }

    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data }, { status: res.status });
    }

    const item = {
      id: "tt_" + Date.now(),
      platform: "tiktok",
      topic: data.title || "TikTok video",
      creator: data.author_name ? "@" + data.author_name : "Unknown",
      hookText: data.title || "",
      description: "",
      views: null,
      likes: null,
      comments: null,
      shares: null,
      posted: Date.now(),
      thumbnail: data.thumbnail_url || null,
      url,
      type: null,
      trigger: null,
      replicability: null,
      cpaAdaptability: null,
      velocity: null,
      statsUnavailable: true,
    };

    return Response.json({ items: [item] });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
