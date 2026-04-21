import { describe, it, expect } from "vitest";
import { parseLanguagePair } from "./parse.js";

describe("parseLanguagePair", () => {
  it("should parse auto-detect with single target (:zh)", () => {
    const result = parseLanguagePair(":zh");
    expect(result.source).toBe("");
    expect(result.targets).toEqual(["zh-CN"]);
  });

  it("should parse explicit source and target (en:zh)", () => {
    const result = parseLanguagePair("en:zh");
    expect(result.source).toBe("en");
    expect(result.targets).toEqual(["zh-CN"]);
  });

  it("should parse auto-detect with multiple targets (:zh+ja)", () => {
    const result = parseLanguagePair(":zh+ja");
    expect(result.source).toBe("");
    expect(result.targets).toEqual(["zh-CN", "ja"]);
  });

  it("should parse explicit source with multiple targets (en:zh+ja+ko)", () => {
    const result = parseLanguagePair("en:zh+ja+ko");
    expect(result.source).toBe("en");
    expect(result.targets).toEqual(["zh-CN", "ja", "ko"]);
  });

  it("should normalize zh to zh-CN", () => {
    const result = parseLanguagePair("zh:en");
    expect(result.source).toBe("zh-CN");
    expect(result.targets).toEqual(["en"]);
  });

  it("should handle whitespace around parts", () => {
    const result = parseLanguagePair(" en : zh + ja ");
    expect(result.source).toBe("en");
    expect(result.targets).toEqual(["zh-CN", "ja"]);
  });

  it("should throw on missing colon", () => {
    expect(() => parseLanguagePair("zh")).toThrow('Invalid language pair format: "zh"');
  });

  it("should throw on missing target", () => {
    expect(() => parseLanguagePair("en:")).toThrow('Missing target language in pair: "en:"');
  });
});
