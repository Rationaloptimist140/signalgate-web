import { VertexAI } from '@google-cloud/vertexai';

const VALID_TICKERS = ["BTC", "SOL", "ETH"];

const vertex = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID || 'signalgate-live',
  location: 'us-central1',
});

const model = vertex.getGenerativeModel({ model: 'gemini-1.5-flash' });

function validateApiKey(req) {
  const authHeader = req.headers["authorization"];
  const xApiKey = req.headers["x-api-key"];

  let key = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    key = authHeader.slice(7);
  } else if (xApiKey) {
    key = xApiKey;
  }

  if (!key) return { valid: false, error: "Missing API key" };
  if (!key.startsWith("sg_live_")) return { valid: false, error: "Invalid API key format" };
  return { valid: true };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = validateApiKey(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.error, hint: "Get your key at signalgate-web.vercel.app" });
  }

  const ticker = (req.query.symbol || req.query.ticker || req.body?.ticker || req.body?.symbol || "").toUpperCase();

  if (!ticker) {
    return res.status(400).json({ error: "Missing ticker. Provide ?symbol=BTC or body { ticker: 'BTC' }" });
  }

  if (!VALID_TICKERS.includes(ticker)) {
    return res.status(400).json({ error: `Unsupported ticker: ${ticker}. Supported: ${VALID_TICKERS.join(", ")}` });
  }

  try {
    const prompt = `You are a crypto market sentiment analyst. Analyze the current market sentiment for ${ticker} (${tickerFullName(ticker)}).

Return a JSON object with exactly these fields:
{
  "ticker": "${ticker}",
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": <number from -100 to 100, negative = bearish, positive = bullish>,
  "confidence": <number from 0 to 100>,
  "thesis": "<2-3 sentence analysis explaining the sentiment>",
  "signals": ["<signal1>", "<signal2>", "<signal3>"],
  "timeframe": "short-term" | "medium-term" | "long-term",
  "timestamp": "${new Date().toISOString()}"
}

Base your analysis on:
- Recent price action trends for ${ticker}
- Macro crypto market conditions
- On-chain metrics and network activity
- Institutional and retail sentiment indicators
- Technical analysis patterns

Return ONLY the JSON object, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.candidates[0].content.parts[0].text.trim();
    const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const data = JSON.parse(clean);

    return res.status(200).json({
      success: true,
      data,
      powered_by: "Gemini 1.5 Flash via Vertex AI",
      version: "1.0.0"
    });

  } catch (err) {
    console.error("Sentiment error:", err);
    return res.status(500).json({ error: "Failed to generate sentiment", details: err.message });
  }
}

function tickerFullName(ticker) {
  const names = { BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" };
  return names[ticker] || ticker;
}