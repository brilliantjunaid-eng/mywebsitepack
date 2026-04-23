// netlify/functions/generate-hook.js
// ─────────────────────────────────────────────────────────
// Uses Groq API (free tier — no credit card needed)
// 1. Go to console.groq.com → sign up free
// 2. Go to API Keys → Create API key → copy it
// 3. Netlify → Site configuration → Environment variables
//    Add: GROQ_API_KEY = your key
// 4. Push this file to GitHub — Netlify auto-redeploys
// ─────────────────────────────────────────────────────────

exports.handler = async function (event) {

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  var body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  var topic   = (body.topic   || "").trim();
  var subject = (body.subject || "general").trim();

  if (!topic) {
    return { statusCode: 400, body: "Topic is required" };
  }

  var prompt = [
    "A student is about to study \"" + topic + "\" in " + subject + ".",
    "Generate a curiosity warm-up in this EXACT JSON structure.",
    "Respond with ONLY the JSON — no markdown fences, no preamble, nothing else.",
    "",
    "{",
    "  \"title\": \"Topic name in 3-5 words\",",
    "  \"hook\": \"One sentence that makes the topic intriguing, under 20 words\",",
    "  \"hookLong\": \"2-3 sentences giving a deeper insight. Under 80 words. No textbook tone.\",",
    "  \"beauty\": \"One sentence on what makes this topic beautiful or surprising\",",
    "  \"lens\": \"One sentence: what to actively watch for while studying this\",",
    "  \"payoff\": \"One sentence on why understanding this pays off long term\",",
    "  \"visualKind\": \"generic-curve\",",
    "  \"visualTitle\": \"5-7 word title for a conceptual diagram\",",
    "  \"visualCaption\": \"One sentence on what that diagram would show\",",
    "  \"lowSupport\": [",
    "    \"Encouraging sentence for when a student's focus is low or flat\",",
    "    \"A second encouraging option for low focus\"",
    "  ],",
    "  \"midSupport\": [",
    "    \"Gentle nudge for when focus is middling\",",
    "    \"A second mid-focus nudge\"",
    "  ],",
    "  \"highSupport\": [",
    "    \"Quiet acknowledgement for when focus is strong\",",
    "    \"A second quiet acknowledgement\"",
    "  ],",
    "  \"challenge\": {",
    "    \"question\": \"A deep retrieval question for after the session\",",
    "    \"cues\": \"One sentence: what a strong answer should include\"",
    "  }",
    "}",
    "",
    "Tone: warm, curious, like a thoughtful mentor. Not a textbook. Not generic."
  ].join("\n");

  var response;
  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch (e) {
    console.error("Groq fetch failed:", e);
    return { statusCode: 502, body: "Upstream API error" };
  }

  var data;
  try {
    data = await response.json();
  } catch (e) {
    return { statusCode: 502, body: "Invalid upstream response" };
  }

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected Groq response:", JSON.stringify(data));
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unexpected response", detail: data })
    };
  }

  var text = data.choices[0].message.content;
  var clean = text.replace(/```json|```/g, "").trim();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: clean
  };
};
