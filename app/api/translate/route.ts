import { NextRequest, NextResponse } from "next/server";
import { translateText, translateHtml } from "@/lib/translate";
import { isValidLocale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang, html, batch } = body;

    if (!targetLang || !isValidLocale(targetLang)) {
      return NextResponse.json(
        { error: "Missing or invalid 'targetLang' field" },
        { status: 400 },
      );
    }

    if (targetLang === "en") {
      // For batch, return originals
      if (Array.isArray(batch)) {
        return NextResponse.json({
          translations: batch.map((item: { text: string }) => item.text),
        });
      }
      return NextResponse.json({ translated: text || html || "" });
    }

    // Batch translation: [{ text: "..." }, { text: "..." }]
    if (Array.isArray(batch)) {
      const translations: string[] = [];
      for (const item of batch) {
        if (typeof item.text === "string" && item.text.trim()) {
          translations.push(await translateText(item.text, targetLang));
        } else {
          translations.push(item.text || "");
        }
      }
      return NextResponse.json({ translations });
    }

    // HTML translation
    if (html && typeof html === "string") {
      const translated = await translateHtml(html, targetLang);
      return NextResponse.json({ translated });
    }

    // Plain text translation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 },
      );
    }

    const translated = await translateText(text, targetLang);
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
