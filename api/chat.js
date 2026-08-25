export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages = [] } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Chat is temporarily unavailable." });
    if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: "A question is required." });
    const input = messages.slice(-12).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 4000) }));
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-5.6-luna", instructions: "You are the friendly TalkNMe general conversation assistant. Answer everyday questions clearly and naturally. Be warm, concise and useful. You can answer questions about travel, relationships, work, technology, general knowledge, planning and everyday decisions. Do not pretend to be a human or a professional. For medical, legal or financial questions, give general information and encourage the user to consult an appropriate qualified professional for important decisions. Never claim certainty where it is not justified. Do not repeatedly mention AI unless the user asks. Keep replies conversational.", input })
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: data?.error?.message || "I couldn't answer that right now." });
    return res.status(200).json({ answer: data.output_text || "I couldn't generate an answer. Please try again." });
  } catch (error) {
    console.error("TalkNMe chat error", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
