import openaiPkg from "openai";
const { Configuration, OpenAIApi } = openaiPkg;
import { getConfig } from "./config.js";
import getPrompt, { getStyleMessage } from "./prompt.js";

function createClient() {
  const config = getConfig();

  if (!config.apiKey) {
    throw new Error("缺少 AI API Key，请设置 COOL_COMMIT_AI_API_KEY 环境变量");
  }

  if (!config.model) {
    throw new Error(`provider "${config.provider}" 缺少 model 配置，请检查 provider preset`);
  }

  const configuration = new Configuration({
    apiKey: config.apiKey,
    basePath: config.baseURL,
  });

  return {
    client: new OpenAIApi(configuration),
    config,
  };
}

export async function generateCommitMessage(diff,options={lang: "en",prefix: "feat",message:""}) {
  if(options.message){
    return getStyleMessage(options)
  }

  const { client, config } = createClient();
  const prompt=getPrompt({
    diff,
    ...options
  });

  try {
    const res = await client.createChatCompletion({
      model: config.model,
      messages: [
        { role: "system", content: "You generate git commit messages." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100
    });

    return res.data.choices[0].message.content.trim();
  } catch (error) {
    const reason =
      error?.response?.data?.message ||
      error?.response?.statusText ||
      error?.code ||
      error?.message ||
      "unknown error";

    throw new Error(`生成 commit message 失败：${reason}`);
  }
}
