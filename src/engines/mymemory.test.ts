import { describe, it, expect } from "vitest";
import { MyMemoryEngine } from "./mymemory.js";

describe("MyMemoryEngine", () => {
  it("should translate Hello to Chinese", async () => {
    const engine = new MyMemoryEngine();
    const result = await engine.translate("Hello", "en", "zh-CN");
    expect(result.engine).toBe("mymemory");
    expect(result.targetLanguage).toBe("zh-CN");
    expect(result.text).toBeTruthy();
  }, 30000);

  it("should auto-detect source language", async () => {
    const engine = new MyMemoryEngine();
    const result = await engine.translate("Hello", "", "zh-CN");
    expect(result.sourceLanguage).toBeTruthy();
    expect(result.text).toBeTruthy();
  }, 30000);
});
