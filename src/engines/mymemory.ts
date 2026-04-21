import type { TranslateEngine } from "./types.js";
import type { TranslateResult } from "../types/index.js";

/** MyMemory 翻译引擎实现 */
export class MyMemoryEngine implements TranslateEngine {
  readonly name = "mymemory" as const;

  private readonly baseUrl = "https://api.mymemory.translated.net/get";

  async translate(text: string, from: string, to: string): Promise<TranslateResult> {
    const langPair = `${from || "autodetect"}|${to}`;
    const url = new URL(this.baseUrl);
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", langPair);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`MyMemory API request failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      responseData: {
        translatedText: string;
        detectedLanguage?: string;
      };
      responseStatus: number;
    };

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory API error: status ${data.responseStatus}`);
    }

    return {
      sourceLanguage: data.responseData.detectedLanguage ?? from,
      targetLanguage: to,
      text: data.responseData.translatedText,
      engine: "mymemory",
    };
  }
}
