/**
 * 获取配置
 * 从环境变量获取 apiKey 和 baseURL
 */
export function getConfig() {
  const apiKey = process.env.COOL_COMMIT_DASHSCOPE_API_KEY;
  const baseURL = process.env.COOL_COMMIT_DASHSCOPE_API_BASE||"https://dashscope.aliyuncs.com/compatible-mode/v1";
  const lang = process.env.COOL_COMMIT_LANG || "en";
  return {
    apiKey,
    baseURL,
    lang
  };
}