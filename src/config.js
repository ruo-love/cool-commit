import "dotenv/config";

const DEFAULT_PROVIDER_PRESETS = {
  dashscope: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-turbo",
  },
  openai: {
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    model: "openai/gpt-4o-mini",
  },
};

function parseUserProviderPresets() {
  const raw = (process.env.COOL_COMMIT_AI_PROVIDER_PRESETS || "").trim();

  if (!raw) {
    return {};
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `COOL_COMMIT_AI_PROVIDER_PRESETS 必须是合法 JSON：${error.message}`
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("COOL_COMMIT_AI_PROVIDER_PRESETS 必须是对象，例如 {\"vendor\":{\"baseURL\":\"...\",\"model\":\"...\"}}");
  }

  return Object.entries(parsed).reduce((acc, [name, preset]) => {
    const providerName = String(name).trim().toLowerCase();

    if (!providerName) {
      throw new Error("COOL_COMMIT_AI_PROVIDER_PRESETS 中存在空 provider 名称");
    }

    if (!preset || typeof preset !== "object" || Array.isArray(preset)) {
      throw new Error(`provider "${providerName}" 的配置必须是对象`);
    }

    const baseURL = String(preset.baseURL || "").trim();
    const model = String(preset.model || "").trim();

    if (!baseURL) {
      throw new Error(`provider "${providerName}" 缺少 baseURL`);
    }

    if (!model) {
      throw new Error(`provider "${providerName}" 缺少 model`);
    }

    acc[providerName] = { baseURL, model };
    return acc;
  }, {});
}

export function getProviderPresets() {
  return {
    ...DEFAULT_PROVIDER_PRESETS,
    ...parseUserProviderPresets(),
  };
}

export function getConfig() {
  const provider = (process.env.COOL_COMMIT_AI_PROVIDER || "dashscope").trim().toLowerCase();
  const providerPresets = getProviderPresets();
  const preset = providerPresets[provider];

  if (!preset) {
    throw new Error(
      `不支持的 AI 厂商: ${provider}。可选值: ${Object.keys(providerPresets).join(", ")}`
    );
  }

  return {
    provider,
    apiKey: (process.env.COOL_COMMIT_AI_API_KEY || "").trim(),
    baseURL: preset.baseURL,
    model: preset.model,
    lang: (process.env.COOL_COMMIT_LANG || "en").trim().toLowerCase(),
  };
}
