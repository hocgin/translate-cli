import { normalizeLanguageCode } from "./language.js";

/** 解析后的语言对 */
export interface ParsedLanguagePair {
  /** 源语言代码，空字符串表示自动检测 */
  source: string;
  /** 目标语言代码列表 */
  targets: string[];
}

/**
 * 解析语言对字符串
 * - ":zh" -> { source: "", targets: ["zh-CN"] }
 * - "en:zh" -> { source: "en", targets: ["zh-CN"] }
 * - ":zh+ja" -> { source: "", targets: ["zh-CN", "ja"] }
 * - "en:zh+ja+ko" -> { source: "en", targets: ["zh-CN", "ja", "ko"] }
 */
export function parseLanguagePair(input: string): ParsedLanguagePair {
  const colonIndex = input.indexOf(":");

  if (colonIndex === -1) {
    throw new Error(`Invalid language pair format: "${input}". Expected "from:to" or ":to".`);
  }

  const source = normalizeLanguageCode(input.slice(0, colonIndex).trim());
  const targetsRaw = input.slice(colonIndex + 1).trim();

  if (!targetsRaw) {
    throw new Error(`Missing target language in pair: "${input}"`);
  }

  const targets = targetsRaw
    .split("+")
    .map((t) => normalizeLanguageCode(t.trim()))
    .filter((t) => t.length > 0);

  if (targets.length === 0) {
    throw new Error(`No valid target languages in pair: "${input}"`);
  }

  return { source, targets };
}
