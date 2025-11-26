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