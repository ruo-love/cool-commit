import openaiPkg from "openai";
const { Configuration, OpenAIApi } = openaiPkg;
import { getConfig } from './config.js';
import getPrompt,{getStyleMessage} from "./prompt.js";
const config = getConfig()
if (!config.apiKey) {
  console.error("❌ 缺少 API Key，请设置 COOL_COMMIT_DASHSCOPE_API_KEY 环境变量");
  process.exit(1);
}
const configuration = new Configuration({
  apiKey: config.apiKey,
  basePath: config.baseURL,
});
const openai = new OpenAIApi(configuration);

const MODEL = process.env.QWEN_MODEL || "qwen-turbo";

export async function generateCommitMessage(diff,options={lang: "en",prefix: "feat",message:""}) {
  if(options.message){
    return getStyleMessage(options)
  }
  const prompt=getPrompt({
    diff,
    ...options
  }); 
  const res = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: "You generate git commit messages." },
      { role: "user", content: prompt }
    ],
    max_tokens: 100
  });

  return res.data.choices[0].message.content.trim();
}
