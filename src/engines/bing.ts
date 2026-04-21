import { translate as bingTranslate } from "bing-translate-api";
import type { TranslateEngine } from "./types.js";
import type { TranslateResult } from "../types/index.js";

/** Bing 使用 zh-Hans/zh-Hant 格式 */
function toBingCode(code: string): string {
  if (code === "zh-CN") return "zh-Hans";
  if (code === "zh-TW") return "zh-Hant";
  return code;
}

/** Bing 返回的代码转回标准格式 */
function fromBingCode(code: string): string {
  if (code === "zh-Hans") return "zh-CN";
  if (code === "zh-Hant") return "zh-TW";
  return code;
}

/** Bing 翻译引擎实现 */
export class BingEngine implements TranslateEngine {
  readonly name = "bing" as const;

  async translate(text: string, from: string, to: string): Promise<TranslateResult> {
    const bingTo = toBingCode(to);
    const result = await bingTranslate(text, from || "auto-detect", bingTo);

    return {
      sourceLanguage: fromBingCode(result.language.from),
      targetLanguage: to,
      text: result.translation,
      engine: "bing",
    };
  }
}
