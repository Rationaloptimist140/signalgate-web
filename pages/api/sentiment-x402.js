// /pages/api/sentiment-x402.js
// x402 paid endpoint - agents pay $0.05 USDC on Base per call
// No API key needed - payment IS the auth via x402 middleware

import { VertexAI } from '@google-cloud/vertexai';

const VALID_TICKERS = ["BTC", "SOL", "ETH"];

const vertex = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID || '476342546520',
  location: 'us-central1',
});

const model = vertex.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Payment, X-Payment-Response");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ticker = (
    req.query.symbol ||
    req.query.ticker ||
    req.body?.ticker ||
    req.body?.symbol ||
    ""
  ).toUpperCase();

  if (!ticker) {
    return res.status(400).json({
      error: "Missing ticker",
      usage: "GET /api/sentiment-x402?symbol=BTC",
      supported: VALID_TICKERS,
    });
  }

  if (!VALID_TICKERS.includes(ticker)) {
    return res.status(400).json({
      error: `Unsupported ticker: ${ticker}`,
      supported: VALID_TICKERS,
    });
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
      payment: "x402 / USDC on Base",
      powered_by: "Gemini 1.5 Flash via Vertex AI",
      version: "2.0.0",
    });

  } catch (err) {
    console.error("Sentiment x402 error:", err);
    return res.status(500).json({
      error: "Failed to generate sentiment",
      details: err.message,
    });
  }
}

function tickerFullName(ticker) {
  const names = { BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" };
  return names[ticker] || ticker;
}