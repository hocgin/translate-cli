import type { TranslateResult, Verbosity } from "../types/index.js";
import { getLanguageName } from "./language.js";

/**
 * 格式化翻译结果输出
 * - brief: 仅译文
 * - normal: 单目标仅译文，多目标显示 [语言] 译文
 * - verbose: 显示引擎、源语言、目标语言、译文
 */
export function formatResult(result: TranslateResult, allResults: TranslateResult[], verbosity: Verbosity): string {
  switch (verbosity) {
    case "brief":
      return result.text;

    case "verbose":
      return formatVerbose(result);

    case "normal":
    default:
      if (allResults.length > 1) {
        return `[${getLanguageName(result.targetLanguage)}] ${result.text}`;
      }
      return result.text;
  }
}

function formatVerbose(result: TranslateResult): string {
  const lines = [
    `[${result.engine}]`,
    `${getLanguageName(result.sourceLanguage)} -> ${getLanguageName(result.targetLanguage)}`,
    result.text,
  ];
  return lines.join("\n");
}
