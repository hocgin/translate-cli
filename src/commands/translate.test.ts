import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runCommand } from "./translate.js";
import type { CliOptions } from "../types/index.js";

const baseOptions: CliOptions = {
  engine: "mymemory",
  verbosity: "normal",
  interactive: false,
  file: undefined,
  listLanguages: false,
};

describe("runCommand", () => {
  let stderrOutput: string[];
  let stdoutOutput: string[];
  let exitCode: number | null;

  beforeEach(() => {
    stderrOutput = [];
    stdoutOutput = [];
    exitCode = null;
    vi.spyOn(process.stderr, "write").mockImplementation((data: string) => {
      stderrOutput.push(data);
      return true;
    });
    vi.spyOn(process.stdout, "write").mockImplementation((data: string) => {
      stdoutOutput.push(data);
      return true;
    });
    vi.spyOn(process, "exit").mockImplementation((code?: number) => {
      exitCode = code ?? 0;
      throw new Error(`process.exit(${code})`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should error when no language pair provided", async () => {
    await expect(runCommand(baseOptions, undefined, [])).rejects.toThrow("process.exit");
    expect(stderrOutput.join("")).toContain("Missing language pair");
  });

  it("should error on invalid language pair format", async () => {
    await expect(runCommand(baseOptions, "invalid", ["Hello"])).rejects.toThrow("process.exit");
    expect(stderrOutput.join("")).toContain("Invalid language pair format");
  });

  it("should error when no text provided", async () => {
    Object.defineProperty(process.stdin, "isTTY", { value: true, writable: true });

    await expect(runCommand(baseOptions, ":zh", [])).rejects.toThrow("process.exit");
    expect(stderrOutput.join("")).toContain("No input text provided");
  });

  it("should show languages with --list-languages flag", async () => {
    await runCommand({ ...baseOptions, listLanguages: true }, undefined, []);
    const full = stdoutOutput.join("");
    expect(full).toContain("English");
    expect(full).toContain("zh-CN");
  });

  it("should translate text with mymemory engine", async () => {
    await runCommand(baseOptions, ":zh", ["Hello"]);
    const full = stdoutOutput.join("");
    expect(full).toBeTruthy(); // should have output
  }, 30000);

  it("should translate with verbose mode", async () => {
    await runCommand({ ...baseOptions, verbosity: "verbose" }, ":zh", ["Hello"]);
    const full = stdoutOutput.join("");
    expect(full).toContain("[mymemory]");
  }, 30000);

  it("should translate with brief mode", async () => {
    await runCommand({ ...baseOptions, verbosity: "brief" }, ":zh", ["Hello"]);
    const full = stdoutOutput.join("");
    expect(full).toBeTruthy();
    expect(full).not.toContain("[mymemory]");
  }, 30000);

  it("should translate to multiple targets", async () => {
    await runCommand(baseOptions, ":zh+ja", ["Hello"]);
    const full = stdoutOutput.join("");
    expect(full).toContain("Chinese (Simplified)");
    expect(full).toContain("Japanese");
  }, 30000);

  it("should handle file read errors gracefully", async () => {
    await expect(
      runCommand({ ...baseOptions, file: "/nonexistent/file.txt" }, ":zh", []),
    ).rejects.toThrow("process.exit");
    expect(stderrOutput.join("")).toContain("Failed to read input");
  });
});
