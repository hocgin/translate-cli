---
name: translate-cli
description: >
  CLI translation tool supporting multiple engines (Google/Bing/MyMemory). Translate text between 100+
  languages from terminal. Supports text args, stdin pipe, file input, multi-target languages, interactive
  REPL mode, and multiple output formats. Use when user says: "翻译", "translate", "翻译文本",
  "翻译文件", "translate text", "translate file", "命令行翻译", "terminal translation",
  "批量翻译", "多语言翻译", "translate to chinese", "翻译成中文", "translate to english",
  "翻译成英文", "管道翻译", "interactive translation"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# translate-cli

多引擎命令行翻译工具，灵感来自 translate-shell。支持 Google / Bing / MyMemory 三种翻译引擎，100+ 语言，多种输入输出方式。

## 安装

```bash
# 全局安装（需要 Node.js >= 18）
pnpm add -g @hocgin/translate-cli

# 或从源码构建
cd /path/to/translate-cli
pnpm build && npm link
```

## CLI 语法

```
translate [OPTIONS] [SOURCE]:[TARGETS] [TEXT]...
```

### 语言对格式

格式为 `[源语言]:[目标语言]`，多个目标语言用 `+` 连接：

| 格式 | 含义 |
|------|------|
| `:zh` | 自动检测源语言，翻译为中文 |
| `en:zh` | 英译中 |
| `:zh+ja+ko` | 自动检测，同时翻译为中文、日语、韩语 |
| `zh:en` | 中译英 |
| `:en+fr+de` | 自动检测，同时翻译为英语、法语、德语 |

`zh` 会自动映射为 `zh-CN`。运行 `translate --list-languages` 查看所有支持的语言代码。

## 输入方式

```bash
# 命令行参数
translate :zh "Hello World"

# 管道输入（stdin）
echo "Hello World" | translate :zh
cat file.txt | translate :zh

# 从文件读取
translate -f input.txt :zh

# 多行文本管道
echo -e "Hello\nWorld" | translate :zh
```

输入优先级：命令行参数 > `-f` 文件 > stdin 管道。

## 输出模式

```bash
# 普通模式（默认）：单目标仅输出译文，多目标显示 [语言] 前缀
translate :zh+ja Hello
# [Chinese (Simplified)] 你好
# [Japanese] こんにちは

# 简短模式（brief）：仅输出译文文本，适合管道拼接
translate -b :zh Hello
# 你好

# 详细模式（verbose）：显示引擎、语言对、译文
translate -v :zh Hello
# [google]
# English -> Chinese (Simplified)
# 你好
```

## 翻译引擎

```bash
# Google（默认）
translate -e google :zh Hello

# Bing
translate -e bing :zh Hello

# MyMemory
translate -e mymemory :zh Hello
```

### 引擎差异

| 引擎 | 特点 |
|------|------|
| `google` | 默认引擎，支持语言最多，自动检测准确 |
| `bing` | 微软翻译，中文使用 zh-Hans/zh-Hant 格式（内部自动转换） |
| `mymemory` | 开源翻译 API，无需认证，适合短文本 |

## 交互模式（REPL）

```bash
translate -I :zh
```

进入 REPL 后直接输入文本即可翻译。支持以下命令：

| 命令 | 说明 | 示例 |
|------|------|------|
| `:help` | 显示帮助 | `:help` |
| `:q` / `:quit` | 退出 | `:q` |
| `:e <engine>` | 切换引擎 | `:e bing` |
| `:s <from>:<to>` | 切换语言对 | `:s en:ja` |
| `:l` | 列出支持的语言 | `:l` |

## 完整选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-e, --engine <name>` | 翻译引擎（google/bing/mymemory） | `google` |
| `-b, --brief` | 简短输出模式（仅译文） | `false` |
| `-v, --verbose` | 详细输出模式 | `false` |
| `-I, --interactive` | 交互式 REPL 模式 | `false` |
| `-f, --file <path>` | 从文件读取输入 | - |
| `--list-languages` | 列出所有支持的语言 | `false` |
| `-V, --version` | 显示版本号 | - |

## 常用场景

### 翻译单个词/句

```bash
translate :zh serendipity
translate en:zh 你好世界
translate -v :en 你好世界
```

### 翻译为多种语言

```bash
translate :zh+ja+ko "Good morning"
translate en:zh+fr+de+es "Hello"
```

### 翻译文件内容

```bash
translate -f readme.md :zh
cat article.txt | translate :zh
```

### 在脚本中调用

```bash
# 获取纯文本翻译结果
RESULT=$(translate -b :zh "Hello World")
echo "Translation: $RESULT"

# 批量翻译
while read -r line; do
  translate -b :zh "$line"
done < words.txt
```

### 从其他命令管道翻译

```bash
# 翻译日志中的错误信息
grep "ERROR" app.log | translate :zh

# 翻译 git commit 信息
git log --oneline -1 | translate :zh

# 翻译 curl 响应
curl -s api.example.com/data | jq -r '.message' | translate :zh
```

## 项目架构

```
src/
├── cli.ts                 # CLI 入口，commander 参数注册
├── types/index.ts         # 核心类型定义
├── engines/
│   ├── types.ts           # TranslateEngine 接口
│   ├── google.ts          # Google 翻译引擎（@vitalets/google-translate-api）
│   ├── bing.ts            # Bing 翻译引擎（bing-translate-api）
│   ├── mymemory.ts        # MyMemory 翻译引擎（免费 API）
│   └── index.ts           # 引擎注册表与工厂（惰性单例）
├── commands/
│   ├── translate.ts       # 核心翻译逻辑（输入获取、翻译执行、错误处理）
│   ├── interactive.ts     # 交互式 REPL 模式
│   └── languages.ts       # 语言列表输出
└── utils/
    ├── language.ts        # 语言代码映射表（100+ 语言）、别名规范化
    ├── parse.ts           # 语言对解析器（:zh, en:zh+ja 格式）
    └── display.ts         # 输出格式化（brief/normal/verbose）
```

### 核心类型

```typescript
type EngineName = "google" | "bing" | "mymemory";

interface TranslateEngine {
  readonly name: EngineName;
  translate(text: string, from: string, to: string): Promise<TranslateResult>;
}

interface TranslateResult {
  sourceLanguage: string;  // 检测到的源语言
  targetLanguage: string;  // 目标语言
  text: string;            // 翻译结果
  engine: EngineName;      // 使用的引擎
}
```

### 引擎扩展

添加新翻译引擎需要：

1. 在 `src/engines/` 下新建文件，实现 `TranslateEngine` 接口
2. 在 `src/engines/index.ts` 的 `engineFactories` 中注册
3. 在 `src/types/index.ts` 的 `EngineName` 中添加名称

```typescript
// 示例：添加新引擎
import type { TranslateEngine } from "./types.js";
import type { TranslateResult } from "../types/index.js";

export class DeepLEngine implements TranslateEngine {
  readonly name = "deepl" as const;

  async translate(text: string, from: string, to: string): Promise<TranslateResult> {
    // 实现翻译逻辑
    return { sourceLanguage: from, targetLanguage: to, text: "...", engine: "deepl" };
  }
}
```

## 开发

```bash
pnpm install       # 安装依赖
pnpm build         # 构建（tsup）
pnpm dev           # 开发模式运行（tsx）
pnpm test          # 运行测试（vitest）
pnpm test:coverage # 测试覆盖率报告
pnpm lint          # 代码检查（eslint）
pnpm format        # 代码格式化（prettier）
```

## 错误处理

CLI 对以下场景有明确的错误提示：

- 缺少语言对：`Error: Missing language pair`
- 无效语言对格式：`Error: Invalid language pair format`
- 缺少输入文本：`Error: No input text provided`
- 文件读取失败：`Error: Failed to read input`
- 翻译 API 失败：`Error: Translation failed`
- 未知引擎：`Error: Unknown engine`

## See Also

- [translate-shell](https://github.com/soimort/translate-shell) - 灵感来源
- [@vitalets/google-translate-api](https://github.com/vitalets/google-translate-api) - Google 翻译 Node.js 库
- [bing-translate-api](https://github.com/nicolo-ribaudo/bing-translate-api) - Bing 翻译 Node.js 库
- [MyMemory API](https://mymemory.translated.net/) - 开源翻译 API
