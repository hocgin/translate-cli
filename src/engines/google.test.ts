import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoogleEngine } from "./google.js";

// Mock the google-translate-api module
vi.mock("@vitalets/google-translate-api", () => ({
  translate: vi.fn().mockResolvedValue({
    text: "你好",
    raw: {
      src: "en",
      confidence: 1,
    },
  }),
}));

describe("GoogleEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should translate Hello to Chinese", async () => {
    const engine = new GoogleEngine();
    const result = await engine.translate("Hello", "", "zh-CN");
    expect(result.engine).toBe("google");
    expect(result.targetLanguage).toBe("zh-CN");
    expect(result.text).toBe("你好");
  });

  it("should auto-detect source language", async () => {
    const engine = new GoogleEngine();
    const result = await engine.translate("Hello", "auto", "zh-CN");
    expect(result.sourceLanguage).toBe("en");
  });

  it("should translate with explicit source language", async () => {
    const engine = new GoogleEngine();
    const result = await engine.translate("Hello", "en", "ja");
    expect(result.sourceLanguage).toBe("en");
    expect(result.targetLanguage).toBe("ja");
  });
});
