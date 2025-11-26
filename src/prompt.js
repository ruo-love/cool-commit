function getPrompt(options){
    const {lang,prefix,diff} = options;
    return `
    你是一个资深程序员，请根据下面的 git diff 自动生成高质量 commit message。
    要求：
    1. 使用 Conventional Commit 格式以"${prefix}: " 开头
    2. 保持简洁、语义清晰
    3. 不要解释，不要生成多余文本
    4. 请将 commit message 用简洁、专业的${lang}语音生成"
    === DIFF START ===
    ${diff}
    === DIFF END ===
    `;
}

export default getPrompt;