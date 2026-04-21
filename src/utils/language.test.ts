import { describe, it, expect } from "vitest";
import { getLanguageName, normalizeLanguageCode } from "./language.js";

describe("getLanguageName", () => {
  it("should return name for known code", () => {
    expect(getLanguageName("en")).toBe("English");
    expect(getLanguageName("zh-CN")).toBe("Chinese (Simplified)");
    expect(getLanguageName("ja")).toBe("Japanese");
  });

  it("should return code for unknown code", () => {
    expect(getLanguageName("xx")).toBe("xx");
  });
});

describe("normalizeLanguageCode", () => {
  it("should normalize zh to zh-CN", () => {
    expect(normalizeLanguageCode("zh")).toBe("zh-CN");
  });

  it("should pass through other codes", () => {
    expect(normalizeLanguageCode("en")).toBe("en");
    expect(normalizeLanguageCode("ja")).toBe("ja");
    expect(normalizeLanguageCode("zh-TW")).toBe("zh-TW");
  });
});
