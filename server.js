import express from "express";

const app = express();

app.use(express.json());

app.get("/price", (req, res) => {
  const { symbol } = req.query;

  res.json({
    symbol,
    price: 258.33
  });
});

app.get("/tools", (req, res) => {
  res.json({
    tools: [
      {
        name: "get_price",
        description: "Get real-time stock price",
        input_schema: {
          type: "object",
          properties: {
            symbol: { type: "string" }
          },
          required: ["symbol"]
        }
      }
    ]
  });
});

app.post("/tools/get_price", (req, res) => {
  const { symbol } = req.body;

  res.json({
    symbol,
    price: 258.33
  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});