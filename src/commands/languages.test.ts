import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { showLanguages } from "./languages.js";

describe("showLanguages", () => {
  let output: string[];

  beforeEach(() => {
    output = [];
    vi.spyOn(process.stdout, "write").mockImplementation((data: string) => {
      output.push(data);
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should output language table with header", () => {
    showLanguages();
    const full = output.join("");
    expect(full).toContain("Code");
    expect(full).toContain("Language");
    expect(full).toContain("English");
    expect(full).toContain("zh-CN");
    expect(full).toContain("Japanese");
  });
});
