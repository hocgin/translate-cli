import type { EngineName } from "../types/index.js";
import type { TranslateEngine } from "./types.js";
import { GoogleEngine } from "./google.js";
import { BingEngine } from "./bing.js";
import { MyMemoryEngine } from "./mymemory.js";

/** 引擎实例缓存 */
const engineCache = new Map<string, TranslateEngine>();

/** 引擎创建工厂 */
const engineFactories: Record<EngineName, () => TranslateEngine> = {
  google: () => new GoogleEngine(),
  bing: () => new BingEngine(),
  mymemory: () => new MyMemoryEngine(),
};

/** 获取翻译引擎实例（惰性创建，单例缓存） */
export function getEngine(name: EngineName): TranslateEngine {
  let engine = engineCache.get(name);
  if (!engine) {
    const factory = engineFactories[name];
    if (!factory) {
      throw new Error(`Unknown engine: ${name}. Available: ${Object.keys(engineFactories).join(", ")}`);
    }
    engine = factory();
    engineCache.set(name, engine);
  }
  return engine;
}

/** 获取所有可用引擎名称 */
export function getAvailableEngines(): EngineName[] {
  return Object.keys(engineFactories) as EngineName[];
}

export type { TranslateEngine } from "./types.js";
