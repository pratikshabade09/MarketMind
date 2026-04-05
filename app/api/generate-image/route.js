export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const contentType = response.headers.get("content-type");

    // ❌ if JSON → model loading or error
    if (!contentType || contentType.includes("application/json")) {
      const err = await response.json();
      console.log("HF ERROR:", err);
      return Response.json({ error: "Model loading" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: { "Content-Type": "image/png" },
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" });
  }
}