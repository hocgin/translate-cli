import type { EngineName, TranslateResult } from "../types/index.js";

/** 翻译引擎接口 */
export interface TranslateEngine {
  /** 引擎名称 */
  readonly name: EngineName;
  /** 翻译文本 */
  translate(text: string, from: string, to: string): Promise<TranslateResult>;
}
