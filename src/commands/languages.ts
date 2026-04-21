import { languages } from "../utils/language.js";

/** 显示所有支持的语言列表 */
export function showLanguages(): void {
  const codeWidth = 10;
  process.stdout.write(`Code${" ".repeat(codeWidth - 4)}Language\n`);
  process.stdout.write("-".repeat(codeWidth) + "  " + "-".repeat(30) + "\n");

  for (const lang of languages) {
    const code = lang.code.padEnd(codeWidth);
    process.stdout.write(`${code}${lang.name}\n`);
  }
}
