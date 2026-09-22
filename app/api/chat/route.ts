import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getContent } from "@/lib/content-store";
import { chatbotInstruction } from "@/lib/chatbot-instruction";
import { logChatQuery } from "@/lib/chat-logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. 'messages' array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Friendly fallback if API key is not yet set by the user
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        {
          reply:
            "Assalamu'alaikum! Selamat datang di PMB UNIPDU.\n\n⚠️ **Catatan Sistem:** Kunci API Google Gemini (`GEMINI_API_KEY`) belum dimasukkan ke dalam berkas `.env.local`.\n\nUntuk mengaktifkannya:\n1. Dapatkan API Key gratis di [Google AI Studio](https://aistudio.google.com/app/api-keys).\n2. Masukkan ke file `.env.local`: `GEMINI_API_KEY=kunci_anda`.\n3. Restart server pengembangan.",
          isSetupNotice: true,
        },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { content } = await getContent();
    const systemInstruction = chatbotInstruction(content);
    const preferredModel = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
    const candidateModels = Array.from(
      new Set(
        [
          preferredModel,
          "gemini-flash-lite-latest",
          "gemini-3.8-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash",
          "gemini-flash-latest",
        ].filter(Boolean)
      )
    );

    const userMessages = messages.filter((m: { role: string; content: string }) => m.role === "user");
    const lastUserQuestion = userMessages[userMessages.length - 1]?.content || "";

    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(
          `Error generating content with ${modelName}, trying next model:`,
          err?.message || err
        );
      }
    }

    if (!responseText) {
      if (lastError) {
        console.error("All candidate Gemini models failed. Last error:", lastError);
      }
      return NextResponse.json(
        {
          reply:
            "Mohon maaf, layanan AI sedang mengalami kendala. Silakan hubungi Sekretariat PMB melalui kontak yang tertera di halaman ini.",
        },
        { status: 500 }
      );
    }

    const replyText =
      responseText ||
      `Mohon maaf, saya belum dapat memberikan jawaban. Silakan hubungi Sekretariat PMB melalui WhatsApp di ${content.contact.whatsapp}.`;

    logChatQuery({
      question: lastUserQuestion,
      reply: replyText,
      status: "answered",
      hasContactReferral:
        replyText.includes(content.contact.whatsapp) ||
        replyText.toLowerCase().includes("whatsapp") ||
        replyText.toLowerCase().includes("sekretariat"),
    }).catch(err => console.warn("Chat log recording skipped:", err));

    return NextResponse.json({
      reply: replyText,
    });
  } catch (error: any) {
    console.error("Unexpected Chat API Error:", error);
    return NextResponse.json(
      {
        reply:
          "Mohon maaf, layanan AI sedang mengalami kendala. Silakan hubungi Sekretariat PMB melalui kontak yang tertera di halaman ini.",
      },
      { status: 500 }
    );
  }
}
