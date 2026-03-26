"use client";

import { useState, useEffect, useRef } from "react";

const clientCache = new Map<string, string>();

function getCacheKey(text: string, lang: string) {
  return `${lang}:${text.slice(0, 100)}`;
}

/**
 * Hook to translate dynamic content via the /api/translate endpoint.
 * Returns the original text immediately, then updates with translation.
 * Results are cached client-side to avoid repeat API calls.
 */
export function useTranslatedText(text: string, lang: string): string {
  const [translated, setTranslated] = useState(text);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!text || lang === "en") {
      setTranslated(text);
      return;
    }

    const key = getCacheKey(text, lang);
    const cached = clientCache.get(key);
    if (cached) {
      setTranslated(cached);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setTranslated(text); // show original while loading

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: lang }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.translated) {
          clientCache.set(key, d.translated);
          setTranslated(d.translated);
        }
      })
      .catch(() => {
        // ignore abort errors or network errors — fallback to original
      });

    return () => controller.abort();
  }, [text, lang]);

  return translated;
}

/**
 * Hook to translate HTML content via the /api/translate endpoint.
 * Strips HTML, translates the plain‐text, then wraps in paragraphs.
 */
export function useTranslatedHtml(html: string, lang: string): string {
  const [translated, setTranslated] = useState(html);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!html || lang === "en") {
      setTranslated(html);
      return;
    }

    const key = `html:${getCacheKey(html, lang)}`;
    const cached = clientCache.get(key);
    if (cached) {
      setTranslated(cached);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setTranslated(html);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, targetLang: lang }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.translated) {
          clientCache.set(key, d.translated);
          setTranslated(d.translated);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [html, lang]);

  return translated;
}

/**
 * Translate an array of strings. Returns originals immediately, then
 * updates as translations come in.
 */
export function useTranslatedArray(texts: string[], lang: string): string[] {
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (lang === "en" || texts.length === 0) {
      setTranslated(texts);
      return;
    }

    // Check cache first
    const results = texts.map((t) => {
      const cached = clientCache.get(getCacheKey(t, lang));
      return cached || null;
    });

    if (results.every((r) => r !== null)) {
      setTranslated(results as string[]);
      return;
    }

    // Use batch API for uncached items
    const controller = new AbortController();
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batch: texts.map((text) => ({ text })),
        targetLang: lang,
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.translations && Array.isArray(d.translations)) {
          // Cache each translation
          d.translations.forEach((t: string, i: number) => {
            if (t && texts[i]) {
              clientCache.set(getCacheKey(texts[i], lang), t);
            }
          });
          setTranslated(d.translations);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [texts.join("|"), lang]);

  return translated;
}
