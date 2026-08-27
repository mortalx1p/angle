// Real data via YouTube Data API v3 — official, legitimate, no scraping.
// Needs a free YOUTUBE_API_KEY (Google Cloud Console -> enable "YouTube Data API v3").
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "trending";
    const key = process.env.YOUTUBE_API_KEY;

    if (!key) {
      return Response.json({ error: "YOUTUBE_API_KEY is not set" }, { status: 400 });
    }

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&order=viewCount&maxResults=12&q=${encodeURIComponent(q)}&key=${key}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return Response.json({ error: searchData }, { status: searchRes.status });
    }

    const ids = (searchData.items || []).map((it) => it.id.videoId).filter(Boolean);
    if (ids.length === 0) {
      return Response.json({ items: [] });
    }

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids.join(",")}&key=${key}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    if (!statsRes.ok) {
      return Response.json({ error: statsData }, { status: statsRes.status });
    }

    const items = (statsData.items || []).map((v) => ({
      id: "yt_" + v.id,
      platform: "youtube",
      topic: v.snippet.title,
      creator: v.snippet.channelTitle,
      hookText: v.snippet.title,
      description: v.snippet.description || "",
      views: Number(v.statistics.viewCount || 0),
      likes: Number(v.statistics.likeCount || 0),
      comments: Number(v.statistics.commentCount || 0),
      shares: null,
      posted: new Date(v.snippet.publishedAt).getTime(),
      thumbnail: v.snippet.thumbnails?.medium?.url || null,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      type: null,
      trigger: null,
      replicability: null,
      cpaAdaptability: null,
      velocity: null,
    }));

    return Response.json({ items });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
