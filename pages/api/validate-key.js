export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

  if (req.method === "OPTIONS") return res.status(200).end();

  const authHeader = req.headers["authorization"];
  const xApiKey = req.headers["x-api-key"];

  let key = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    key = authHeader.slice(7);
  } else if (xApiKey) {
    key = xApiKey;
  }

  if (!key) {
    return res.status(401).json({ valid: false, error: "No API key provided" });
  }

  if (!key.startsWith("sg_live_")) {
    return res.status(401).json({ valid: false, error: "Invalid API key format" });
  }

  return res.status(200).json({
    valid: true,
    key_prefix: key.slice(0, 12) + "...",
    message: "API key is valid",
    tickers_available: ["BTC", "ETH", "SOL"]
  });
}