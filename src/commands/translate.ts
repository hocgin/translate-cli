import fs from "node:fs";
import ora from "ora";
import type { CliOptions, TranslateResult } from "../types/index.js";
import { getEngine } from "../engines/index.js";
import { parseLanguagePair } from "../utils/parse.js";
import { formatResult } from "../utils/display.js";
import { showLanguages } from "./languages.js";

/** 从 stdin 读取文本 */
async function readStdin(): Promise<string | null> {
  if (process.stdin.isTTY) {
    return null;
  }

  return new Promise((resolve) => {
    const chunks: string[] = [];
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => chunks.push(chunk));
    process.stdin.on("end", () => {
      const text = chunks.join("").trim();
      resolve(text.length > 0 ? text : null);
    });
    process.stdin.on("error", () => resolve(null));
  });
}

/** 从文件读取文本 */
async function readFile(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, "utf-8").trim();
}

/** 获取输入文本：命令行参数 > 文件 > stdin */
async function getInputText(cliText: string[], fileOption: string | undefined): Promise<string | null> {
  // 优先使用命令行参数
  if (cliText.length > 0) {
    return cliText.join(" ");
  }

  // 其次从文件读取
  if (fileOption) {
    return readFile(fileOption);
  }

  // 最后从 stdin 读取
  return readStdin();
}

/** 执行翻译 */
async function translate(text: string, source: string, targets: string[], engineName: CliOptions["engine"]): Promise<TranslateResult[]> {
  const engine = getEngine(engineName);
  const results: TranslateResult[] = [];

  for (const target of targets) {
    const result = await engine.translate(text, source, target);
    results.push(result);
  }

  return results;
}

/** 主命令入口 */
export async function runCommand(
  options: CliOptions,
  languagePair: string | undefined,
  text: string[],
): Promise<void> {
  // 处理 --list-languages
  if (options.listLanguages) {
    showLanguages();
    return;
  }

  // 处理交互模式
  if (options.interactive) {
    const { startRepl } = await import("./interactive.js");
    await startRepl(options, languagePair);
    return;
  }

  // 验证语言对
  if (!languagePair) {
    process.stderr.write("Error: Missing language pair. Usage: translate [SOURCE]:[TARGETS] [TEXT]\n");
    process.exit(1);
  }

  let parsed;
  try {
    parsed = parseLanguagePair(languagePair);
  } catch (err) {
    process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  let inputText: string | null;
  try {
    inputText = await getInputText(text, options.file);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: Failed to read input - ${message}\n`);
    process.exit(1);
  }

  if (!inputText) {
    process.stderr.write("Error: No input text provided. Use text argument, -f <file>, or pipe via stdin.\n");
    process.exit(1);
  }

  const spinner = ora("Translating...").start();

  try {
    const results = await translate(inputText, parsed.source, parsed.targets, options.engine);
    spinner.stop();

    for (const result of results) {
      const output = formatResult(result, results, options.verbosity);
      process.stdout.write(output + "\n");
    }
  } catch (err) {
    spinner.stop();
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: Translation failed - ${message}\n`);
    process.exit(1);
  }
}
