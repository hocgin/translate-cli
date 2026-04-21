import { describe, it, expect } from "vitest";
import { getEngine, getAvailableEngines } from "./index.js";

describe("Engine Registry", () => {
  it("should return available engine names", () => {
    const engines = getAvailableEngines();
    expect(engines).toContain("google");
    expect(engines).toContain("bing");
    expect(engines).toContain("mymemory");
  });

  it("should create and cache engine instances", () => {
    const engine1 = getEngine("google");
    const engine2 = getEngine("google");
    expect(engine1).toBe(engine2); // same instance
    expect(engine1.name).toBe("google");
  });

  it("should throw for unknown engine", () => {
    expect(() => getEngine("unknown" as never)).toThrow("Unknown engine: unknown");
  });

  it("should create different engine types", () => {
    const google = getEngine("google");
    const mymemory = getEngine("mymemory");
    expect(google.name).toBe("google");
    expect(mymemory.name).toBe("mymemory");
    expect(google).not.toBe(mymemory);
  });
});
