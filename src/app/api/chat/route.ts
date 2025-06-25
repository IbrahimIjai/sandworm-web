import { convertToCoreMessages, streamText } from "ai";
import type { Message } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import { ChatService } from "@/services/firebase/db/chats/ChatService";
import { auth } from "@/services/auth";
import { runPredefinedQuery } from "@/helpers";
import { generateWormQLFromNaturalLanguage } from "@/ai/action";

export async function POST(request: Request) {
  console.log("📩 Request received at /api/chat");

  let id: string;
  let messages: Array<Message>;
  try {
    const body = await request.json();
    id = body.id;
    messages = body.messages;
  } catch (err) {
    console.error("❌ Failed to parse request body:", err);
    return new Response("Invalid request body", { status: 400 });
  }

  let session;
  try {
    session = await auth();
    console.log("✅ Auth session:", session?.user?.id);
  } catch (err) {
    console.error("❌ Auth check failed:", err);
    return new Response("Failed to authenticate", { status: 500 });
  }

  let coreMessages;
  try {
    coreMessages = convertToCoreMessages(messages).filter(
      m => m.content.length > 0
    );
    console.log("✅ Core messages:", coreMessages);
  } catch (err) {
    console.error("❌ Failed to convert messages:", err);
    return new Response("Invalid message format", { status: 400 });
  }

  let result;
  try {
    // Hardcoding actions and SQL query for now to test node integration and demo functionality. Will refactor for dynamic input and scalability later temporary code.
    result = await streamText({
      model: geminiProModel,
      system: `You are Worm AI — a smart assistant that helps users explore onchain data.

      Answer clearly and concisely. If the user asks a direct question like "is Vitalik broke?" or makes a comment implying financial status after a balance query, respond with a light-hearted joke: "He's not broke, he's pre-rich."
      
      Only make this joke if the user explicitly asks about being broke. Do not include jokes in regular balance responses.
      
      Today's date is ${new Date().toLocaleDateString()}.`,
      messages: coreMessages,
      tools: {
        getWeather: {
          description: "Get the current weather at a location",
          parameters: z.object({
            latitude: z.number().describe("Latitude coordinate"),
            longitude: z.number().describe("Longitude coordinate"),
          }),
          execute: async ({ latitude, longitude }) => {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
            );
            const weatherData = await response.json();
            return weatherData;
          },
        },
        trackCetusAttackerActivity: {
          description:
            "Tracks the swap and liquidity activity of a suspicious wallet on Cetus DEX. Useful for analyzing attacker behavior, identifying backruns, or tracing fund flows.",
          parameters: z.object({}),
          execute: async () => {
            const query = `SELECT
  'swap' AS action,
  pool,
  amount_in,
  amount_out,
  atob,
  fee_amount,
  NULL AS liquidity_removed,
  NULL AS amountA,
  NULL AS amountB,
  "txDigest",
  "eventSeq",
  "timestampMs"
FROM
  sui.cetus_swap
WHERE
  sender = '0xe28b50cef1d633ea43d3296a3f6b67ff0312a5f1a99f0af753c85b8b5de8ff06'

UNION ALL

SELECT
  'remove_liquidity' AS action,
  pool,
  NULL AS amount_in,
  NULL AS amount_out,
  NULL AS atob,
  NULL AS fee_amount,
  liquidity AS liquidity_removed,
  "amountA",
  "amountB",
  "txDigest",
  "eventSeq",
  "timestampMs"
FROM
  sui.cetus_remove_liquidity
WHERE
  sender = '0xe28b50cef1d633ea43d3296a3f6b67ff0312a5f1a99f0af753c85b8b5de8ff06'

ORDER BY
  "timestampMs" DESC;
            `;

            try {
              const queryResult = await runPredefinedQuery({
                query,
                provider: {
                  executionMethod: "indexed",
                },
              });
              return queryResult;
            } catch (err) {
              return {
                error: "Failed to fetch Cetus attacker activity.",
                details: err instanceof Error ? err.message : String(err),
              };
            }
          },
        },

        generateWormQL: {
          description: "Generate a WormQL query based on user intent",
          parameters: z.object({
            prompt: z
              .string()
              .describe("User question or instruction in natural language"),
          }),
          execute: async ({ prompt }) => {
            const result = await generateWormQLFromNaturalLanguage({ prompt });
            return result;
          },
        },

        runVitalikBalanceQuery: {
          description: `
          Visualizes the ETH and BASE chain balances of vitalik.eth as a bar chart.
          Use this when the user asks to "show as chart", "bar chart", "graph it", or "visualize Vitalik's balance".
            `.trim(),
          parameters: z.object({}),
          execute: async () => {
            const query = `
              SELECT balance, chain
              FROM account vitalik.eth
              ON eth, base
            `;

            try {
              console.log("🔍 Running vitalik.eth balance query:", query);
              const queryResult = await runPredefinedQuery({ query });
              return queryResult;
            } catch (err) {
              return {
                error: "Failed to query vitalik.eth balances",
                details: err instanceof Error ? err.message : String(err),
              };
            }
          },
        },
        runVitalikBalanceChartQuery: {
          description:
            "Fetches ETH and BASE balances for vitalik.eth chart visualization in bar chart",
          parameters: z.object({}),
          execute: async () => {
            const query = `
              SELECT balance, chain
              FROM account vitalik.eth
              ON eth, base
            `;

            try {
              console.log("🔍 Running vitalik.eth chart balance query:", query);
              const queryResult = await runPredefinedQuery({ query });
              return queryResult;
            } catch (err) {
              return {
                error: "Failed to fetch vitalik.eth balances",
                details: err instanceof Error ? err.message : String(err),
              };
            }
          },
        },
      },

      onFinish: async ({ responseMessages }) => {
        console.log("💾 onFinish triggered for chat:", id);
        if (session?.user?.id) {
          try {
            await ChatService.saveChat({
              id,
              messages: [...coreMessages, ...responseMessages],
              userId: session.user.id,
            });
            console.log("✅ Chat saved successfully");
          } catch (error) {
            console.error("❌ Failed to save chat:", error);
          }
        }
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text",
      },
    });
    console.log("✅ streamText() returned");
  } catch (err) {
    console.error("❌ Error during streamText():", err);
    return new Response("AI generation failed", { status: 500 });
  }

  try {
    console.log("🔄 Streaming response...");
    console.log("ddd", result);
    const text = await result.textStream;
    console.log("🧠 Model output:", text);
  } catch (err) {
    console.error("❌ Failed to extract model output:", err);
  }

  try {
    return result.toDataStreamResponse({});
  } catch (err) {
    console.error("❌ Failed to stream response:", err);
    return new Response("Failed to stream response", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await ChatService.getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await ChatService.deleteChatById({ id });
    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
