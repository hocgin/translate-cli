# @hocgin/translate-cli
[English](README.md) | [中文](README-zh.md)

A command-line translation tool supporting multiple engines (Google / Bing / MyMemory), inspired by [translate-shell](https://github.com/soimort/translate-shell).

## Installation

```bash
# npm
npm install -g @hocgin/translate-cli

# pnpm
pnpm add -g @hocgin/translate-cli

# yarn
yarn global add @hocgin/translate-cli
```

Requires Node.js >= 18.

## Usage

```
translate [OPTIONS] [SOURCE]:[TARGETS] [TEXT]...
```

### Basic Translation

```bash
# Auto-detect source language
translate :zh Hello

# Specify source and target
translate en:zh Hello World

# Translate to multiple languages
translate :zh+ja+ko Hello
```

### Input Sources

```bash
# Text argument
translate :zh "Hello World"

# Stdin pipe
echo "Hello World" | translate :zh

# Read from file
translate -f input.txt :zh
```

### Output Modes

```bash
# Normal (default): multi-target shows [Language] prefix
translate :zh+ja Hello

# Brief: translation text only, ideal for piping
translate -b :zh Hello

# Verbose: show engine, source/target languages, and translation
translate -v :zh Hello
```

### Switch Engine

```bash
translate -e google :zh Hello       # default
translate -e bing :zh Hello
translate -e mymemory :zh Hello
```

### Interactive REPL

```bash
translate -I :zh
```

Inside the REPL, type text to translate directly. Special commands:

| Command        | Description                          |
|----------------|--------------------------------------|
| `:help`        | Show available commands              |
| `:q` / `:quit` | Exit the REPL                        |
| `:e <engine>`  | Switch translation engine            |
| `:s <from>:<to>` | Switch language pair              |
| `:l`           | List supported languages             |

### List Languages

```bash
translate --list-languages
```

### All Options

| Option              | Description                          | Default  |
|---------------------|--------------------------------------|----------|
| `-e, --engine`      | Translation engine (google/bing/mymemory) | `google` |
| `-b, --brief`       | Brief output mode                    | `false`  |
| `-v, --verbose`     | Verbose output mode                  | `false`  |
| `-I, --interactive` | Interactive REPL mode                | `false`  |
| `-f, --file`        | Read input from file                 | -        |
| `--list-languages`  | List all supported languages         | `false`  |
| `-V, --version`     | Show version number                  | -        |

## Language Pairs

The format is `[SOURCE]:[TARGETS]`, where targets can be combined with `+`:

- `:zh` -- auto-detect to Chinese
- `en:zh` -- English to Chinese
- `:zh+ja+ko` -- auto-detect to Chinese, Japanese, Korean

Run `translate --list-languages` to see all supported language codes.

## Development

```bash
# Build
pnpm build

# Run directly without installing
node dist/cli.js :zh Hello
# or
pnpm dev -- :zh Hello

# Test
pnpm test
pnpm test:coverage

# Lint & Format
pnpm lint
pnpm format
```

## Project Structure

```
src/
├── cli.ts                 # CLI entry, commander registration
├── types/index.ts         # Core type definitions
├── engines/
│   ├── types.ts           # TranslateEngine interface
│   ├── google.ts          # Google engine (default)
│   ├── bing.ts            # Bing engine
│   ├── mymemory.ts        # MyMemory engine
│   └── index.ts           # Engine registry & factory
├── commands/
│   ├── translate.ts       # Main translation logic
│   ├── interactive.ts     # Interactive REPL mode
│   └── languages.ts       # Language list output
└── utils/
    ├── language.ts        # Language code mapping (100+ languages)
    ├── parse.ts           # Language pair parser
    └── display.ts         # Output formatting
```

## License

MIT
