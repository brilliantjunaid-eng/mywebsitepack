// netlify/functions/generate-hook.js
// ─────────────────────────────────────────────────────────
// Uses OpenRouter (free tier available at openrouter.ai)
// Set OPENROUTER_API_KEY in Netlify → Site Settings → Environment Variables
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
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,  // ← set this in Netlify
        "HTTP-Referer": "https://iridescent-blini-4cf89c.netlify.app", // your site URL
        "X-Title": "Pact Study App"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free", // free model, no cost
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch (e) {
    console.error("OpenRouter fetch failed:", e);
    return { statusCode: 502, body: "Upstream API error" };
  }

  var data;
  try {
    data = await response.json();
  } catch (e) {
    return { statusCode: 502, body: "Invalid upstream response" };
  }

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected OpenRouter response:", JSON.stringify(data));
    return { statusCode: 502, body: "Empty response from OpenRouter" };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: data.choices[0].message.content
  };
};