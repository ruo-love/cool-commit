# cool-commit – Copilot Instructions

## Project Overview

`cool-commit` is a Node.js CLI tool (`cool`) that uses Alibaba DashScope/Qwen AI to auto-generate conventional git commit messages from `git diff` output.

## Running the CLI

```bash
# Install globally
npm install -g .

# Commands
cool g [prefix] [message]   # Auto mode: uses config lang, lets user confirm/regenerate/cancel
cool m [prefix] [message]   # Manual mode: prompts for language and push preference
```

No build, test, or lint scripts exist in this project.

## Required Environment Variables

| Variable | Description | Default |
|---|---|---|
| `COOL_COMMIT_DASHSCOPE_API_KEY` | Alibaba DashScope API key (required) | — |
| `COOL_COMMIT_DASHSCOPE_API_BASE` | API base URL | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `COOL_COMMIT_LANG` | Commit message language (`en` or `zh`) | `en` |
| `QWEN_MODEL` | Qwen model name | `qwen-turbo` |

## Architecture

```
src/index.js   → CLI entry point (Commander.js). Defines `g` (auto) and `m` (manual) commands.
src/ai.js      → OpenAI-compatible client targeting DashScope. Calls getPrompt or getStyleMessage.
src/config.js  → Reads all env vars and exports a config object (called at module load time).
src/git.js     → Git operations via execa: diff, staged diff, add, commit, push, isGitRepo.
src/prompt.js  → Builds the AI prompt and formats commit messages. Exports getPrompt (default) and getStyleMessage.
src/utils.js   → Thin execa wrapper (runCmd); not currently used in the main flow.
```

**Key data flow:**
1. `getGitDiff()` + `getStagedDiff()` → concatenated diff string
2. If `message` arg is provided → `getStyleMessage()` bypasses AI entirely
3. Otherwise → `getPrompt()` builds a Chinese-language system prompt → sent to Qwen → trimmed response

## Commit Message Format

All generated messages follow this pattern:
```
{icon}{prefix}: {description} <🐥 YYYY-MM-DD HH:mm:ss>
```

- Icons are defined in `getIcon()` in `src/prompt.js` (e.g., `✨feat`, `🔧fix`, `📚docs`)
- Unknown prefixes fall back to `📌`
- `getStyleMessage()` produces the same format without AI when a manual message is passed

## Module System

The package uses **ES Modules** (`"type": "module"` in package.json). All imports must use `.js` extensions and there is no CommonJS interop — use `import`/`export` throughout.

## Key Dependency Notes

- **`execa`** (v8): Used for all git subprocess calls. Returns `{ stdout }` directly.
- **`@inquirer/prompts`** (removed): Replaced with `inquirer@^8` for Node 12 compatibility. Use `inquirer.prompt([{ type: 'list', name, message, choices }])` and destructure the result.
- **`openai`** (v3): The OpenAI SDK v3 is used as an API-compatible client for DashScope via the `basePath` option. Uses `Configuration` + `OpenAIApi` classes; responses are accessed via `res.data.choices[0].message.content`. (Note: v4 was dropped for Node 12 compatibility — v4's `baseURL` option and `client.chat.completions.create()` API differ.)
