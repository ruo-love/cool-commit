import _execa from "execa";
const { execa } = _execa;

export async function runCmd(cmd, args = []) {
  const { stdout } = await execa(cmd, args);
  return stdout;
}
