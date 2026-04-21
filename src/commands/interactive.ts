import * as readline from "node:readline";
import ora from "ora";
import type { CliOptions, TranslateResult } from "../types/index.js";
import { getEngine, getAvailableEngines } from "../engines/index.js";
import { parseLanguagePair } from "../utils/parse.js";
import { formatResult } from "../utils/display.js";
import { showLanguages } from "./languages.js";
import { getLanguageName } from "../utils/language.js";

interface ReplState {
  engine: CliOptions["engine"];
  source: string;
  targets: string[];
  verbosity: CliOptions["verbosity"];
}

const REPL_COMMANDS = {
  help: "Show available commands",
  quit: "Exit the REPL",
  engine: "Switch translation engine (:e <engine>)",
  switch: "Switch language pair (:s <from>:<to>)",
  languages: "List supported languages (:l)",
} as const;

function printHelp(): void {
  process.stdout.write("\nREPL Commands:\n");
  for (const [cmd, desc] of Object.entries(REPL_COMMANDS)) {
    process.stdout.write(`  :${cmd.padEnd(12)} ${desc}\n`);
  }
  process.stdout.write("\n");
}

function parseReplCommand(input: string): { command: string; args: string } {
  const trimmed = input.trim();
  if (!trimmed.startsWith(":")) return { command: "", args: "" };
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { command: trimmed.slice(1).toLowerCase(), args: "" };
  return {
    command: trimmed.slice(1, spaceIndex).toLowerCase(),
    args: trimmed.slice(spaceIndex + 1).trim(),
  };
}

async function executeTranslate(text: string, state: ReplState): Promise<void> {
  const engine = getEngine(state.engine);
  const spinner = ora("Translating...").start();

  try {
    const results: TranslateResult[] = [];
    for (const target of state.targets) {
      const result = await engine.translate(text, state.source, target);
      results.push(result);
    }
    spinner.stop();

    for (const result of results) {
      const output = formatResult(result, results, state.verbosity);
      process.stdout.write(output + "\n");
    }
  } catch (err) {
    spinner.stop();
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
  }
}

export async function startRepl(options: CliOptions, languagePair: string | undefined): Promise<void> {
  // 解析初始语言对
  let source = "";
  let targets = ["zh-CN"];

  if (languagePair) {
    try {
      const parsed = parseLanguagePair(languagePair);
      source = parsed.source;
      targets = parsed.targets;
    } catch (err) {
      process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
      process.exit(1);
    }
  }

  const state: ReplState = {
    engine: options.engine,
    source,
    targets,
    verbosity: options.verbosity,
  };

  const langDisplay = state.source
    ? `${getLanguageName(state.source)} -> ${state.targets.map(getLanguageName).join(", ")}`
    : `auto -> ${state.targets.map(getLanguageName).join(", ")}`;

  process.stdout.write(`translate-cli (REPL mode)\n`);
  process.stdout.write(`Engine: ${state.engine} | Languages: ${langDisplay}\n`);
  process.stdout.write(`Type :help for commands, Ctrl+C to exit\n\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      continue;
    }

    // 解析 REPL 命令
    const { command, args } = parseReplCommand(trimmed);

    if (command === "q" || command === "quit") {
      process.stdout.write("Bye!\n");
      rl.close();
      process.exit(0);
    } else if (command === "help") {
      printHelp();
    } else if (command === "e" || command === "engine") {
      if (!args) {
        process.stdout.write(`Current engine: ${state.engine}\n`);
        process.stdout.write(`Available: ${getAvailableEngines().join(", ")}\n`);
      } else {
        const engines = getAvailableEngines();
        if (engines.includes(args as CliOptions["engine"])) {
          state.engine = args as CliOptions["engine"];
          process.stdout.write(`Engine switched to: ${state.engine}\n`);
        } else {
          process.stderr.write(`Unknown engine: "${args}". Available: ${engines.join(", ")}\n`);
        }
      }
    } else if (command === "s" || command === "switch") {
      if (!args) {
        const display = state.source
          ? `${state.source} -> ${state.targets.join("+")}`
          : `auto -> ${state.targets.join("+")}`;
        process.stdout.write(`Current: ${display}\n`);
      } else {
        try {
          const parsed = parseLanguagePair(args);
          state.source = parsed.source;
          state.targets = parsed.targets;
          const display = state.source
            ? `${getLanguageName(state.source)} -> ${state.targets.map(getLanguageName).join(", ")}`
            : `auto -> ${state.targets.map(getLanguageName).join(", ")}`;
          process.stdout.write(`Languages switched to: ${display}\n`);
        } catch (err) {
          process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
        }
      }
    } else if (command === "l" || command === "languages") {
      showLanguages();
    } else {
      // 普通文本 -> 翻译
      await executeTranslate(trimmed, state);
    }

    rl.prompt();
  }
}
