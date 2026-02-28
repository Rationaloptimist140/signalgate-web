export default function Home() {
  return (
    <main style={{ fontFamily: "monospace", maxWidth: 700, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>SignalGate API</h1>
      <p style={{ color: "#666", marginBottom: 40 }}>
        The sentiment engine for the AI Agent economy. Powered by Gemini 2.0.
      </p>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Endpoints</h2>
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <code style={{ fontWeight: "bold" }}>POST /api/sentiment</code>
        <p style={{ margin: "8px 0 4px" }}>Get AI-powered sentiment for BTC, ETH, or SOL.</p>
        <pre style={{ background: "#e8e8e8", padding: 12, borderRadius: 4, overflow: "auto" }}>{`curl -X POST https://signalgate-web.vercel.app/api/sentiment \\
  -H "Authorization: Bearer sg_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"ticker": "BTC"}'`}</pre>
      </div>
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 40 }}>
        <code style={{ fontWeight: "bold" }}>GET /api/validate-key</code>
        <p style={{ margin: "8px 0 4px" }}>Validate your API key.</p>
        <pre style={{ background: "#e8e8e8", padding: 12, borderRadius: 4, overflow: "auto" }}>{`curl https://signalgate-web.vercel.app/api/validate-key \\
  -H "Authorization: Bearer sg_live_..."`}</pre>
      </div>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Supported Tickers</h2>
      <p>BTC &bull; ETH &bull; SOL</p>
      <h2 style={{ fontSize: 18, margin: "32px 0 12px" }}>MCP Integration</h2>
      <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, overflow: "auto" }}>{`npm install -g signalgate-mcp`}</pre>
    </main>
  );
}