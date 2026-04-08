console.log("🔥 VERSION NUEVA 🔥");

import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {

  if (req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      const request = JSON.parse(body);

      if (request.method === "tools/list") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          tools: [
            {
              name: "get_price",
              description: "Get stock price",
              input_schema: {
                type: "object",
                properties: {
                  symbol: { type: "string" }
                },
                required: ["symbol"]
              }
            }
          ]
        }));
      }

      if (request.method === "tools/call") {
        const symbol = request.params.symbol;

        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d7b58spr01qhndem31lgd7b58spr01qhndem31m0`
        );

        const data = await response.json();

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                symbol,
                price: data.c
              })
            }
          ]
        }));
      }

    });
  } else {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
}

});

server.listen(PORT, () => {
  console.log("NEW VERSION RUNNING");
});