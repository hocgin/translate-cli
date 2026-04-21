import { Command } from "commander";
import type { CliOptions, EngineName, Verbosity } from "./types/index.js";

const program = new Command();

program
  .name("translate")
  .description("A CLI translation tool supporting multiple engines")
  .version("1.0.0")
  .argument("[languagePair]", "Translation language pair, e.g. :zh, en:zh, :zh+ja")
  .argument("[text...]", "Text to translate")
  .option("-e, --engine <name>", "Translation engine", "google" as EngineName)
  .option("-b, --brief", "Brief output mode (translation only)", false)
  .option("-v, --verbose", "Verbose output mode", false)
  .option("-I, --interactive", "Interactive REPL mode", false)
  .option("-f, --file <path>", "Read input from file")
  .option("--list-languages", "List all supported languages", false)
  .action(async (languagePair: string | undefined, text: string[], options: Record<string, unknown>) => {
    const cliOptions: CliOptions = {
      engine: (options.engine as EngineName) ?? "google",
      verbosity: options.verbose ? "verbose" : options.brief ? "brief" : ("normal" as Verbosity),
      interactive: options.interactive as boolean,
      file: options.file as string | undefined,
      listLanguages: options.listLanguages as boolean,
    };

    // 动态导入以延迟加载
    const { runCommand } = await import("./commands/translate.js");
    await runCommand(cliOptions, languagePair, text);
  });

program.parse();
