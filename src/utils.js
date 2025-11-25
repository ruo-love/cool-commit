import { execa } from "execa";

export async function runCmd(cmd, args = []) {
  const { stdout } = await execa(cmd, args);
  return stdout;
}
