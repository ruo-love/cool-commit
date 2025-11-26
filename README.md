# Cool Commit CLI

`cool-commit` 是一个结合 **AI 自动生成 commit message** 的 Git CLI 工具，支持：

- 自动生成规范的 commit message（中英文可选）  
- 一键 `add`、`commit`、可选自动 `push`  
- 集成阿里大模型（DashScope / Qwen）生成 commit message  
- https://bailian.console.aliyun.com/?tab=doc#/doc
---

### 全局安装
```
npm install cool-commit -g

```

### 配置环境变量
1. vim ~/.zshrc
2. 
    ```
    export COOL_COMMIT_DASHSCOPE_API_KEY="api-key" //阿里云 百炼模型api key
    export COOL_COMMIT_LANG="en" //语言 zh\en

    ```


3. source ~/.zshrc


### 快捷命令如下《自选》：

1. cool g [prefix]
2. cool m [prefix]


- 如：
    - cool g fix
    - cool g feat
    - cool m fix
    - cool m feat

### 示例

```
- 🧑‍💻feat: 新增用户登录状态持久化逻辑 <⏰2025-01-12 14:23:51>
- 🔧fix: 修复接口超时情况下的异常分支未正确返回问题 <⏰2025-01-12 14:24:03>
- 📚docs: 更新 README 中的安装步骤与 CLI 使用示例 <⏰2025-01-12 14:24:17>
- ♻️refactor: 重构 diff 合并逻辑以提升大文件性能 <⏰2025-01-12 14:24:30>
- 🎨style: 统一格式化 CLI 输出并优化颜色展示 <⏰2025-01-12 14:24:44>
- 🧪test: 补充生成 commit message 的边界测试用例 <⏰2025-01-12 14:24:56>
- ⚡perf: 优化多次调用 git diff 时的缓存机制降低延迟 <⏰2025-01-12 14:25:12>
- 🧹chore: 调整项目结构并清理无用依赖 <⏰2025-01-12 14:25:23>
- 🏗️build: 修复 Node 环境差异导致的构建脚本失败问题 <⏰2025-01-12 14:25:37>

```


```
-🧑‍💻feat: add persistent user session handling for login flow <⏰2025-01-12 14:32:11>
-🔧fix: resolve timeout error caused by missing fallback in network requests <⏰2025-01-12 14:32:25>
-📚docs: update README with setup instructions and CLI usage examples <⏰2025-01-12 14:32:37>
-♻️refactor: restructure diff parser to improve performance on large commits <⏰2025-01-12 14:32:50>
-🎨style: standardize CLI output formatting and refine color scheme <⏰2025-01-12 14:33:02>
-🧪test: add boundary tests for commit message generation <⏰2025-01-12 14:33:15>
-⚡perf: optimize git diff caching to reduce repeated execution overhead <⏰2025-01-12 14:33:27>
-🧹chore: clean up unused dependencies and reorganize project files <⏰2025-01-12 14:33:41>
-🏗️build: fix build script failure caused by inconsistent Node environment <⏰2025-01-12 14:33:55>
-🤖ci: update CI workflow to support pnpm environments <⏰2025-01-12 14:34:08>
```