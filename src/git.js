import { execa } from "execa";

export async function getGitDiff() {
  const { stdout } = await execa("git", ["diff"]);
  return stdout.trim();
}
export async function getStagedDiff() {
  const { stdout } = await execa("git", ["diff", "--cached"]);
  return stdout.trim();
}

export async function gitAddAll() {
  await execa("git", ["add", "."]);
}

export async function gitCommit(message) {
  await execa("git", ["commit", "-m", message]);
}

export async function gitPush() {
  await execa("git", ["push"]);
}

/**
 * 检查当前目录是否是 Git 仓库
 * @returns {Promise<boolean>} true 表示是 git 仓库
 */
export async function isGitRepo() {
  try {
    // rev-parse 会在 git repo 返回 true，否则报错
    const { stdout } = await execa("git", ["rev-parse", "--is-inside-work-tree"]);
    return stdout.trim() === "true";
  } catch (err) {
    return false;
  }
}
