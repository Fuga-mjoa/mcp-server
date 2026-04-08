import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";

const server = new Server(
  {
    name: "market-data",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// TOOL REAL MCP
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "get_price",
        description: "Get stock price",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string" }
          },
          required: ["symbol"]
        }
      }
    ]
  };
});

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_price") {
    const symbol = request.params.arguments.symbol;

    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d7b58spr01qhndem31lgd7b58spr01qhndem31m0`
    );

    const data = await res.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            symbol,
            price: data.c
          })
        }
      ]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);