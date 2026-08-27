export async function POST(req) {
  try {
    const { system, messages, max_tokens } = await req.json();

    // Groq uses an OpenAI-compatible chat completions endpoint.
    // System prompt + user message get combined into one messages array.
    const groqMessages = [
      { role: "system", content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: max_tokens || 1800,
        messages: groqMessages,
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data }, { status: res.status });
    }

    const text = data?.choices?.[0]?.message?.content || "";

    // Normalize to the same shape the frontend already expects
    // ({ content: [{ type: "text", text }] }), so page.js needs no changes.
    return Response.json({ content: [{ type: "text", text }] });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
