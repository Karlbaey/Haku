import { exec } from "node:child_process";
import util from "node:util";
import prompts from "prompts";
import kleur from "kleur";

const execAsync = util.promisify(exec);

/**
 * 执行 git 命令并返回 stdout（去除首尾空白）
 */
async function runGitCommand(cmd) {
  try {
    const { stdout } = await execAsync(cmd, { cwd: process.cwd() });
    return stdout.trim();
  } catch (error) {
    throw new Error(
      `Git command failed: ${cmd}\n${error.stderr || error.message}`,
    );
  }
}

export async function deploy() {
  console.log(kleur.bold().blue("\n🚀 Deploying via git\n"));

  // 1. 检查是否在 git 仓库中
  try {
    await execAsync("git rev-parse --git-dir", { cwd: process.cwd() });
  } catch {
    console.error(kleur.red("❌ Not inside a Git repository."));
    process.exit(1);
  }

  // 2. 获取当前分支名
  let currentBranch;
  try {
    currentBranch = await runGitCommand("git rev-parse --abbrev-ref HEAD");
    if (currentBranch === "HEAD") {
      console.error(
        kleur.red(
          "❌ You are in detached HEAD state. Please switch to a branch.",
        ),
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      kleur.red(`❌ Failed to get current branch: ${error.message}`),
    );
    process.exit(1);
  }

  // 3. 获取远程仓库名称（默认 origin，可扩展为从配置读取）
  const remote = "origin";
  let remoteUrl;
  try {
    remoteUrl = await runGitCommand(`git remote get-url ${remote}`);
  } catch {
    console.error(kleur.red(`❌ Remote '${remote}' not found.`));
    process.exit(1);
  }

  console.log(kleur.cyan(`📦 Remote: ${remote} -> ${remoteUrl}`));
  console.log(kleur.cyan(`🌿 Branch: ${currentBranch}`));

  // 4. 检查是否有未提交的更改
  let status;
  try {
    status = await runGitCommand("git status --porcelain");
  } catch (error) {
    console.error(kleur.red(`❌ Failed to check git status: ${error.message}`));
    process.exit(1);
  }

  if (status) {
    console.log(kleur.yellow("\n⚠️  You have uncommitted changes:"));
    console.log(
      status
        .split("\n")
        .map((line) => `   ${line}`)
        .join("\n"),
    );
    const { shouldContinue } = await prompts({
      type: "confirm",
      name: "shouldContinue",
      message:
        "Continue with push anyway? (uncommitted changes will not be pushed)",
      initial: false,
    });
    if (!shouldContinue) {
      console.log(kleur.yellow("🛑 Deploy cancelled."));
      return;
    }
  }

  // 5. 确认推送
  const { confirmPush } = await prompts({
    type: "confirm",
    name: "confirmPush",
    message: `Push branch '${currentBranch}' to remote '${remote}'?`,
    initial: true,
  });

  if (!confirmPush) {
    console.log(kleur.yellow("🛑 Deploy cancelled."));
    return;
  }

  // 6. 执行 git push
  console.log(kleur.cyan(`\n⏳ Pushing to ${remote}/${currentBranch}...`));
  try {
    const { stdout, stderr } = await execAsync(
      `git push ${remote} ${currentBranch}`,
      {
        cwd: process.cwd(),
      },
    );
    if (stdout) console.log(stdout);
    if (stderr) console.error(kleur.yellow(stderr));
    console.log(kleur.green("\n✅ Deployed successfully!"));
  } catch (error) {
    console.error(
      kleur.red(`\n❌ Push failed:\n${error.stderr || error.message}`),
    );
    process.exit(1);
  }
}
