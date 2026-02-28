# SignalGate Web

The backend API for [signalgate-mcp](https://github.com/Rationaloptimist140/signalgate-mcp) — the sentiment engine for the AI Agent economy. Powered by Gemini 2.0 Flash.

## API Endpoints

### POST /api/sentiment
Get AI-powered crypto sentiment analysis.

**Headers:**
- `Authorization: Bearer sg_live_...`
- `Content-Type: application/json`

**Body:**
```json
{ "ticker": "BTC" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticker": "BTC",
    "sentiment": "bullish",
    "score": 72,
    "confidence": 85,
    "thesis": "Bitcoin is showing strong momentum...",
    "signals": ["Rising institutional demand", "ETF inflows positive", "On-chain accumulation"],
    "timeframe": "short-term",
    "timestamp": "2026-02-28T12:00:00.000Z"
  },
  "powered_by": "Gemini 2.0 Flash"
}
```

### GET /api/validate-key
Validate your API key.

## Environment Variables

Set these in Vercel dashboard:
- `GEMINI_API_KEY` — your Google Gemini API key

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rationaloptimist140/signalgate-web)

## MCP Integration

Use with Claude Desktop via [signalgate-mcp](https://www.npmjs.com/package/signalgate-mcp):
```bash
npm install -g signalgate-mcp
```