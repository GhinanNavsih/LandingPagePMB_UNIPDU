import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getContent } from "@/lib/content-store";
import { chatbotInstruction } from "@/lib/chatbot-instruction";

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
    const configuredModel = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: configuredModel,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return NextResponse.json({
        reply:
          response.text ||
          `Mohon maaf, saya belum dapat memberikan jawaban. Silakan hubungi Sekretariat PMB melalui WhatsApp di ${content.contact.whatsapp}.`,
      });
    } catch (primaryError: any) {
      console.warn(
        `Error generating content with ${configuredModel}, attempting fallback:`,
        primaryError?.message
      );

      // Try fallback to gemini-flash-latest if configuredModel fails
      if (configuredModel !== "gemini-flash-latest") {
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        return NextResponse.json({
          reply:
            fallbackResponse.text ||
            `Mohon maaf, saya belum dapat memberikan jawaban. Silakan hubungi Sekretariat PMB melalui WhatsApp di ${content.contact.whatsapp}.`,
        });
      }

      throw primaryError;
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      {
        reply:
          "Mohon maaf, layanan AI sedang mengalami kendala. Silakan hubungi Sekretariat PMB melalui kontak yang tertera di halaman ini.",
      },
      { status: 500 }
    );
  }
}
