export async function POST(req) {
  try {
    const { text } = await req.json();

    const prompt = `Rate this marketing content:
${text}
Give Engagement, Clarity, Creativity out of 10`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free", // ✅ stable
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    return Response.json({
      result: data.choices?.[0]?.message?.content || "Error",
    });

  } catch (err) {
    console.error(err);
    return Response.json({ result: "Error" });
  }
}