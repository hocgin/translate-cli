import { describe, it, expect } from "vitest";
import { formatResult } from "./display.js";
import type { TranslateResult, Verbosity } from "../types/index.js";

const makeResult = (overrides: Partial<TranslateResult> = {}): TranslateResult => ({
  sourceLanguage: "en",
  targetLanguage: "zh-CN",
  text: "你好",
  engine: "google",
  ...overrides,
});

describe("formatResult", () => {
  describe("brief mode", () => {
    it("should return only translated text", () => {
      const result = makeResult();
      const output = formatResult(result, [result], "brief");
      expect(output).toBe("你好");
    });
  });

  describe("normal mode", () => {
    it("should return only text for single result", () => {
      const result = makeResult();
      const output = formatResult(result, [result], "normal");
      expect(output).toBe("你好");
    });

    it("should include language tag for multiple results", () => {
      const result = makeResult({ targetLanguage: "zh-CN" });
      const result2 = makeResult({ targetLanguage: "ja", text: "こんにちは" });
      const output = formatResult(result, [result, result2], "normal");
      expect(output).toBe("[Chinese (Simplified)] 你好");
    });
  });

  describe("verbose mode", () => {
    it("should include engine, languages and text", () => {
      const result = makeResult();
      const output = formatResult(result, [result], "verbose");
      expect(output).toContain("[google]");
      expect(output).toContain("English");
      expect(output).toContain("Chinese (Simplified)");
      expect(output).toContain("你好");
    });
  });
});
