
function getIcon(prefix) {
  switch (prefix) {
    case "fix":
    case "bug":
      return "🔧";

    case "feat":
    case "feature":
      return "💻";

    case "docs":
      return "📚";

    case "style":
      return "🎨"; // 代码格式化、样式修改

    case "refactor":
      return "♻️";

    case "perf":
      return "⚡";

    case "test":
      return "🧪";

    case "chore":
      return "🧹";

    case "ci":
      return "🤖";

    case "build":
      return "🏗️";

    case "revert":
      return "⏪";

    default:
      return "📌"; // 其他或未知类型
  }
}

function getPrompt(options){
    const {lang,prefix,diff} = options;
    const date = new Date()
    const updateTime = date.toLocaleString()
    const prefix_icon = getIcon(prefix)+prefix 
    return `
    你是一个资深程序员，请根据下面的 git diff 自动生成高质量 commit message。
    要求：
    1. 使用 Conventional Commit 格式以"${prefix_icon}: " 开头
    2. commit 以" <⏰ ${updateTime}> "结尾,时间格式 YYYY-MM-DD mm:hh:ss
    3. 保持简洁、语义清晰,不要出现换行
    4. 不要解释，不要生成多余文本
    5. 示例：
      💻feat: 移除多余的功能 <⏰ 2025-11-26 07:14:43>
      🔧fix: 修复录音问题 <⏰ 2025-11-26 07:14:43>
    6. 请将 commit message 用简洁、专业的${lang}语音生成"
    === DIFF START ===
    ${diff}
    === DIFF END ===
    `;
}

export function getStyleMessage(options){
  const {prefix,message} = options;
  const date = new Date()
  const updateTime = date.toLocaleString()
  const prefix_icon = getIcon(prefix)+prefix 
  return `${prefix_icon}: ${message} <⏰ ${updateTime}>`
}

export default getPrompt;