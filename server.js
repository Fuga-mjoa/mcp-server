import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {

  if (req.url.startsWith("/price")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const symbol = url.searchParams.get("symbol") || "AAPL";

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d7b58spr01qhndem31lgd7b58spr01qhndem31m0`
    );

    const data = await response.json();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      symbol,
      price: data.c
    }));

  } else {
    res.writeHead(200);
    res.end("MCP server running");
  }

});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});