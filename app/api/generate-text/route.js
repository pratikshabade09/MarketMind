export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = `Generate marketing content:
Product: ${body.product}
Description: ${body.description}
Platform: ${body.platform}
Audience: ${body.audience}
Tone: ${body.tone}

Include:
- Hook
- Caption
- CTA
- Hashtags`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free", // ✅ stable model
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.log("TEXT ERROR:", data.error);
      return Response.json({ text: "Error" });
    }

    return Response.json({
      text: data.choices?.[0]?.message?.content || "Error",
    });

  } catch (err) {
    console.error(err);
    return Response.json({ text: "Server error" });
  }
}
