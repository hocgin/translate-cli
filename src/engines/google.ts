import { translate as googleTranslate } from "@vitalets/google-translate-api";
import type { TranslateEngine } from "./types.js";
import type { TranslateResult } from "../types/index.js";

export class GoogleEngine implements TranslateEngine {
  readonly name = "google" as const;

  async translate(text: string, from: string, to: string): Promise<TranslateResult> {
    const result = await googleTranslate(text, {
      from: from || "auto",
      to,
    });
    return {
      sourceLanguage: result.raw.src,
      targetLanguage: to,
      text: result.text,
      engine: "google",
    };
  }
}
