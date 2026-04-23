// netlify/functions/generate-hook.js
// ─────────────────────────────────────────────────────────
// Uses Google Gemini API (free tier — no credit card needed)
// SETUP:
// 1. Go to aistudio.google.com → Get API key → copy it
// 2. Netlify → Site configuration → Environment variables
//    Add: GEMINI_API_KEY = your key
// 3. Push this file to GitHub and Netlify auto-redeploys
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

  var apiKey = process.env.GEMINI_API_KEY;
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

  var response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    });
  } catch (e) {
    console.error("Gemini fetch failed:", e);
    return { statusCode: 502, body: "Upstream API error" };
  }

  var data;
  try {
    data = await response.json();
  } catch (e) {
    return { statusCode: 502, body: "Invalid upstream response" };
  }

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error("Unexpected Gemini response:", JSON.stringify(data));
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unexpected response", detail: data })
    };
  }

  var text = data.candidates[0].content.parts[0].text;
  var clean = text.replace(/```json|```/g, "").trim();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: clean
  };
};
