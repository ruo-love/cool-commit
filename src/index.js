#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import inquirer from 'inquirer';
import figlet from 'figlet';
import gradientString from 'gradient-string';

import {
  getGitDiff,
  getStagedDiff,
  gitAddAll,
  gitCommit,
  gitPush,
  isGitRepo
} from "./git.js";
import { getConfig } from './config.js';
import { generateCommitMessage } from "./ai.js";
const config = getConfig()
const DEFAULT_FIGLET_OPTS = {
  width: 200,
  whitespaceBreak: false,
};
const program = new Command();
const output = figlet.textSync("cool-commit", DEFAULT_FIGLET_OPTS);
console.log(gradientString.instagram(output));
// 捕获 Ctrl+C
process.on("SIGINT", () => {
  console.log("\n👋 已取消操作");
  process.exit(0);
});

// 手动
program
  .command("m [prefix] [message]")
  .description("Auto AI commit & push")
  .action(async (prefix="feat",message="") => {
    if (!await isGitRepo()) {
      console.log(chalk.red("❌ 当前目录不是一个 Git 仓库"));
      process.exit(1);
    }
    const { lang } = await inquirer.prompt([{
      type: 'list',
      name: 'lang',
      message: '请选择 commit 信息语言：',
      choices: [
        { name: 'English（默认）', value: 'en' },
        { name: '中文', value: 'zh' }
      ],
      default: 'en'
    }]);

    const { pushWay } = await inquirer.prompt([{
      type: 'list',
      name: 'pushWay',
      message: '请选择 push 方式：',
      choices: [
        { name: '手动 push', value: 'manual' },
        { name: '自动 push', value: 'auto' },
      ],
      default: 'manual'
    }]);
    const autoPush = pushWay === 'auto';
    const spinner = ora("Collecting git diff...").start();

    const _git_diff = await getGitDiff();
    const _stage_diff = await getStagedDiff();
    const diff = _git_diff + _stage_diff;
    if (!diff) {
      spinner.fail("没有 diff，无需提交。");
      return;
    }

    spinner.text = "Generating AI commit message...";
    let commitMessage = await generateCommitMessage(diff, {
        lang,
        prefix,
        message
      });

    spinner.succeed("Commit Message:");
    console.log(chalk.green(`\n${commitMessage}\n`));

    spinner.start("git add .");
    await gitAddAll();

    spinner.text = "git commit ...";
    await gitCommit(commitMessage);

    if (autoPush) {
      spinner.text = "git push ...";
      await gitPush();
      spinner.succeed("🎉 Done!");
    } else {
      spinner.succeed("🎉 Commit 完成（未 push）");
      console.log(chalk.yellow("如需 push，请执行： git push\n"));
    }
  });


// 自动
program
  .command("g [prefix] [message]")
  .description("Auto AI commit & push")
  .action(async (prefix="feat",message="") => {
    if (!await isGitRepo()) {
      console.log(chalk.red("❌ 当前目录不是一个 Git 仓库"));
      process.exit(1);
    }
    const spinner = ora("Collecting git diff...").start();

    const _git_diff = await getGitDiff();
    const _stage_diff = await getStagedDiff();
    const diff = _git_diff + _stage_diff;
    if (!diff) {
      spinner.fail("没有 diff，无需提交。");
      return;
    }
    async function todo(){
      spinner.text = "Generating AI commit message...";
      spinner.start("Generating")
      let commitMessage = await generateCommitMessage(diff, {
        lang:config.lang,
        prefix,
        message
      });
      spinner.stop()
      spinner.succeed("Commit Message:");
      console.log(chalk.green(`\n${commitMessage}\n`));
      await gitAddAll();
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: '操作',
        choices: [
          { name: '提交commit', value: '1' },
          { name: '重新生成', value: '2' },
          { name: '取消commit', value: '3' }
        ],
        default: '1'
      }]);
      switch(action){
        case "1":
          gitCommit(commitMessage)
          break;
        case "2":
          todo()
          break;
        case "3":
          break;
      }
    }
    todo()
  });

program.parse();
