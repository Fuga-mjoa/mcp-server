import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  const userQuestion = "¿Cuál es el precio de Apple?";

  // 🧠 PRIMERA LLAMADA (el modelo decide si usar tool)
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: userQuestion,
    tools: [
  {
    type: "function",
    name: "get_price",
    description: "Get real-time stock price",
    parameters: {
      type: "object",
      properties: {
        symbol: {
          type: "string"
        }
      },
      required: ["symbol"]
    }
  }
],
  });

  console.log("DEBUG RESPONSE:", JSON.stringify(response, null, 2));

  // 🔍 Buscar si el modelo llamó a la tool
  const toolCall = response.output.find(
    (item) => item.type === "function_call"
  );

  if (!toolCall) {
    console.log("❌ No se llamó a la tool");
    console.log("Respuesta:", response.output_text);
    return;
  }

  const args = JSON.parse(toolCall.arguments);

  console.log("✅ Tool llamada con:", args);

  // 🌐 Llamar a tu API (Railway)
  const apiResponse = await fetch(
    `https://mcp-server-production-d73a.up.railway.app/price?symbol=${args.symbol}`
  );

  const data = {
  price: 258.33
};

  console.log("📡 API responde:", data);

  // 🔥 SEGUNDA LLAMADA (MANDAR RESULTADO AL MODELO)
  const final = await client.responses.create({
    model: "gpt-4o-mini",

    // 🔑 ESTO ES LO MÁS IMPORTANTE
    previous_response_id: response.id,

    input: [
      {
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(data),
      },
    ],
  });

  console.log("\n💥 RESPUESTA FINAL:\n");
  console.log(final.output_text);
}

run();