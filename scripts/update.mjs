import { exec } from "node:child_process";
import util from "node:util";
import prompts from "prompts";
import kleur from "kleur";

const execAsync = util.promisify(exec);
const upstreamUrl = "https://github.com/Karlbaey/Haku";
const upstreamRemote = "haku-upstream";

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

async function ensureGitRepo() {
  try {
    await execAsync("git rev-parse --git-dir", { cwd: process.cwd() });
  } catch {
    console.error(kleur.red("Error: Not inside a Git repository."));
    process.exit(1);
  }
}

async function getCurrentBranch() {
  const branch = await runGitCommand("git rev-parse --abbrev-ref HEAD");
  if (branch === "HEAD") {
    console.error(
      kleur.red("Error: You are in detached HEAD state. Switch to a branch."),
    );
    process.exit(1);
  }
  return branch;
}

async function getDefaultBranch(remoteUrl) {
  const output = await runGitCommand(`git ls-remote --symref ${remoteUrl} HEAD`);
  const headLine = output
    .split("\n")
    .find((line) => line.startsWith("ref:") && line.endsWith("HEAD"));

  if (!headLine) {
    return "main";
  }

  const match = headLine.match(/^ref:\s+refs\/heads\/(.+)\s+HEAD$/);
  if (!match || !match[1]) {
    return "main";
  }

  return match[1];
}

async function ensureUpstreamRemote(remoteUrl) {
  let existingUrl = "";
  try {
    existingUrl = await runGitCommand(`git remote get-url ${upstreamRemote}`);
  } catch {
    await runGitCommand(`git remote add ${upstreamRemote} ${remoteUrl}`);
    return;
  }

  if (existingUrl !== remoteUrl) {
    await runGitCommand(`git remote set-url ${upstreamRemote} ${remoteUrl}`);
  }
}

export async function update() {
  console.log(kleur.bold().blue("\nUpdating from upstream Haku repository\n"));

  await ensureGitRepo();
  const currentBranch = await getCurrentBranch();

  let status = "";
  try {
    status = await runGitCommand("git status --porcelain");
  } catch (error) {
    console.error(kleur.red(`Error: Failed to check git status: ${error.message}`));
    process.exit(1);
  }

  if (status) {
    console.log(kleur.yellow("\nYou have uncommitted changes:"));
    console.log(
      status
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n"),
    );
    const { shouldContinue } = await prompts({
      type: "confirm",
      name: "shouldContinue",
      message: "Continue update anyway?",
      initial: false,
    });

    if (!shouldContinue) {
      console.log(kleur.yellow("Update cancelled."));
      return;
    }
  }

  let defaultBranch = "main";
  try {
    defaultBranch = await getDefaultBranch(upstreamUrl);
    await ensureUpstreamRemote(upstreamUrl);
    await runGitCommand(`git fetch --depth=1 ${upstreamRemote} ${defaultBranch}`);
  } catch (error) {
    console.error(kleur.red(`Error: Failed to fetch upstream: ${error.message}`));
    process.exit(1);
  }

  console.log(kleur.cyan(`Current branch: ${currentBranch}`));
  console.log(kleur.cyan(`Upstream branch: ${defaultBranch}`));
  console.log(kleur.cyan(`Fetched latest commit from: ${upstreamUrl}`));

  const { mergeMode } = await prompts({
    type: "select",
    name: "mergeMode",
    message: "If conflicts happen, whose changes should be preferred?",
    choices: [
      {
        title: "Prefer my local changes",
        value: "ours",
      },
      {
        title: "Prefer upstream Haku changes",
        value: "theirs",
      },
      {
        title: "Manual conflict resolution",
        value: "manual",
      },
    ],
    initial: 0,
  });

  if (!mergeMode) {
    console.log(kleur.yellow("Update cancelled."));
    return;
  }

  const targetRef = `${upstreamRemote}/${defaultBranch}`;
  const mergeBaseCmd = `git merge --no-ff --no-edit`;
  const mergeCmd =
    mergeMode === "manual"
      ? `${mergeBaseCmd} ${targetRef}`
      : `${mergeBaseCmd} -X ${mergeMode} ${targetRef}`;

  try {
    const { stdout, stderr } = await execAsync(mergeCmd, { cwd: process.cwd() });
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(kleur.yellow(stderr));
    }
    console.log(kleur.green("\nUpdate merged successfully!"));
  } catch (error) {
    console.error(kleur.red("\nMerge reported conflicts or failed."));
    if (mergeMode === "manual") {
      console.log(
        kleur.yellow(
          "Resolve conflicts manually, then commit. Use `git merge --abort` to cancel.",
        ),
      );
    } else {
      console.log(
        kleur.yellow(
          "Try again with another preference mode or resolve conflicts manually.",
        ),
      );
    }
    console.error(kleur.red(error.stderr || error.message));
    process.exit(1);
  }
}
