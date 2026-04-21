/** 翻译引擎名称 */
export type EngineName = "google" | "bing" | "mymemory";

/** 翻译结果 */
export interface TranslateResult {
  /** 检测到的源语言代码 */
  sourceLanguage: string;
  /** 目标语言代码 */
  targetLanguage: string;
  /** 翻译文本 */
  text: string;
  /** 使用的引擎 */
  engine: EngineName;
}

/** 翻译选项 */
export interface TranslateOptions {
  /** 源语言代码，空字符串表示自动检测 */
  source: string;
  /** 目标语言代码列表 */
  targets: string[];
  /** 引擎名称 */
  engine: EngineName;
}

/** 输出详细程度 */
export type Verbosity = "brief" | "normal" | "verbose";

/** 语言信息 */
export interface LanguageInfo {
  /** 语言代码 */
  code: string;
  /** 语言名称（英文） */
  name: string;
}

/** CLI 全局选项 */
export interface CliOptions {
  engine: EngineName;
  verbosity: Verbosity;
  interactive: boolean;
  file: string | undefined;
  listLanguages: boolean;
}
