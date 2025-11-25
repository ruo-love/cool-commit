import OpenAI from "openai";
import { getConfig } from './config.js';
const config = getConfig()
if (!config.apiKey) {
  console.error("❌ 缺少 API Key，请设置 COOL_COMMIT_API_KEY 环境变量");
  process.exit(1);
}
const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseURL
});

const MODEL = process.env.QWEN_MODEL || "qwen-turbo";

export async function generateCommitMessage(diff, lang = "en") {
  const languageInstruction = lang === "zh" 
    ? "请将 commit message 用简洁、专业的中文生成"
    : "Please generate the commit message in English";

  const prompt = `
你是一个资深程序员，请根据下面的 git diff 自动生成高质量 commit message。
要求：
1. 使用 Conventional Commit 格式 (feat / fix / chore / refactor ...)
2. 保持简洁、语义清晰
3. 不要解释，不要生成多余文本
4. ${languageInstruction}

=== DIFF START ===
${diff}
=== DIFF END ===
`;

  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You generate git commit messages." },
      { role: "user", content: prompt }
    ],
    max_tokens: 100
  });

  return res.choices[0].message.content.trim();
}
