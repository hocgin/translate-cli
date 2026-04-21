# @hocgin/translate-cli
[English](README.md) | [中文](README-zh.md)

命令行翻译工具，支持多种翻译引擎（Google / Bing / MyMemory），灵感来自 [translate-shell](https://github.com/soimort/translate-shell)。

## 安装

```bash
# npm
npm install -g @hocgin/translate-cli

# pnpm
pnpm add -g @hocgin/translate-cli

# yarn
yarn global add @hocgin/translate-cli
```

需要 Node.js >= 18。

## 使用方法

```
translate [OPTIONS] [SOURCE]:[TARGETS] [TEXT]...
```

### 基础翻译

```bash
# 自动检测源语言
translate :zh Hello

# 指定源语言和目标语言
translate en:zh Hello World

# 翻译为多种目标语言
translate :zh+ja+ko Hello
```

### 输入来源

```bash
# 命令行参数
translate :zh "Hello World"

# 管道输入
echo "Hello World" | translate :zh

# 从文件读取
translate -f input.txt :zh
```

### 输出模式

```bash
# 普通模式（默认）：多目标语言时显示 [语言] 前缀
translate :zh+ja Hello

# 简短模式：仅输出译文，适合管道拼接
translate -b :zh Hello

# 详细模式：显示引擎、源语言、目标语言、译文
translate -v :zh Hello
```

### 切换引擎

```bash
translate -e google :zh Hello       # 默认引擎
translate -e bing :zh Hello
translate -e mymemory :zh Hello
```

### 交互模式（REPL）

```bash
translate -I :zh
```

进入交互模式后，直接输入文本即可翻译。支持以下特殊命令：

| 命令             | 说明                          |
|------------------|-------------------------------|
| `:help`          | 显示帮助信息                  |
| `:q` / `:quit`   | 退出交互模式                  |
| `:e <engine>`    | 切换翻译引擎                  |
| `:s <from>:<to>` | 切换语言对                    |
| `:l`             | 列出所有支持的语言            |

### 查看支持的语言

```bash
translate --list-languages
```

### 完整选项

| 选项                 | 说明                                   | 默认值     |
|----------------------|----------------------------------------|------------|
| `-e, --engine`       | 翻译引擎（google/bing/mymemory）       | `google`   |
| `-b, --brief`        | 简短输出模式                           | `false`    |
| `-v, --verbose`      | 详细输出模式                           | `false`    |
| `-I, --interactive`  | 交互式 REPL 模式                       | `false`    |
| `-f, --file`         | 从文件读取输入                         | -          |
| `--list-languages`   | 列出所有支持的语言                     | `false`    |
| `-V, --version`      | 显示版本号                             | -          |

## 语言对格式

格式为 `[源语言]:[目标语言]`，多个目标语言用 `+` 连接：

- `:zh` -- 自动检测，翻译为中文
- `en:zh` -- 英译中
- `:zh+ja+ko` -- 自动检测，翻译为中文、日语、韩语

运行 `translate --list-languages` 查看所有支持的语言代码。

## 开发

```bash
# 构建
pnpm build

# 不安装直接运行
node dist/cli.js :zh Hello
# 或
pnpm dev -- :zh Hello

# 测试
pnpm test
pnpm test:coverage

# 代码检查与格式化
pnpm lint
pnpm format
```

## 项目结构

```
src/
├── cli.ts                 # CLI 入口，commander 参数注册
├── types/index.ts         # 核心类型定义
├── engines/
│   ├── types.ts           # TranslateEngine 接口
│   ├── google.ts          # Google 翻译引擎（默认）
│   ├── bing.ts            # Bing 翻译引擎
│   ├── mymemory.ts        # MyMemory 翻译引擎
│   └── index.ts           # 引擎注册表与工厂
├── commands/
│   ├── translate.ts       # 核心翻译逻辑
│   ├── interactive.ts     # 交互式 REPL 模式
│   └── languages.ts       # 语言列表输出
└── utils/
    ├── language.ts        # 语言代码映射（100+ 语言）
    ├── parse.ts           # 语言对解析器
    └── display.ts         # 输出格式化
```

## 许可证

MIT
