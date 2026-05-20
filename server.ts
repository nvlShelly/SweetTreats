import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add it in the Settings > Secrets panel on AI Studio.");
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      
      const ai = getGeminiClient();

      // Format history for Gemini SDK
      // history is expected to be an array of { role: 'user' | 'model', content: string }
      const contents = [
        ...history.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : msg.role,
          parts: [{ text: msg.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are 'Chef Sweetie', the ultra-fast, professional, and super friendly AI head baker of SweetTreats. 
Your goal is to provide concise, delightful, extremely accurate, and professional baking advice.

Important Context:
- SweetTreats currently features these amazing recipes:
  1. Strawberry Cloud Dream Cake (Sponge cake, strawberries, cream, 45 mins, Medium)
  2. Velvet Pink Glazed Donuts (Yeast, beetroot-infused pink glaze, fried, 90 mins, Hard)
  3. Double Choco Brownie Box (Dark chocolate, cocoa powder, butter, eggs, 30 mins, Easy)
  4. Korean Bento Mini Cake (Aesthetic pastel lunchbox cakes with buttercream, 60 mins, Medium)
  5. Lavender Macaron Towers (Lavender-scented shells with honey-lemon ganache, 120 mins, Hard)
  6. Matcha Green Tea Swirls (Matcha muffins with white chocolate, 25 mins, Easy)
  7. Fluffy Cloud Cheesecake (Airy Japanese-style souffle cheesecake, 240 mins, Medium)
  
Rules:
- Always suggest recipes from this list if the user asks for recommendations of cake, donuts, brownies, macarons, cheesecake, etc.
- Provide general baking science, high-quality baking tips, and detailed instructions if they ask about other recipes.
- If someone mentions "simpan" (save) or "suka" (like), remind them that they can click the heart ❤️ (like) or bookmark 🔖 (save) icon directly on each recipe card!
- Keep answers brief, tidy, and beautifully formatted with Markdown, utilizing bullets and bold text.
- Spread love and high energy with emojis: 🍰, ✨, 🧁, 🍪, 🍩, 🥐.
- ALWAYS respond in the same language as the user (default to Indonesian if the user writes in Indonesian, e.g. "Halo Chef!").`,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW
          }
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Chat API Error:", error);
      // If we failed before headers are sent, return 500 JSON, otherwise close SSE with an error tag
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to get AI response" });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message || "Internal stream error" })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
