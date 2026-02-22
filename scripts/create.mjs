import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import kleur from "kleur";

/**
 * 解析命令行参数，提取 --title/-t 和 --permalink/-p 的值
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let cliTitle = null;
  let cliPermalink = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "-t" || arg === "--title") {
      if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        cliTitle = args[i + 1];
        i++;
      } else {
        console.error(kleur.red("Error: --title/-t requires a value"));
        process.exit(1);
      }
    } else if (arg === "-p" || arg === "--permalink") {
      if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        cliPermalink = args[i + 1];
        i++;
      } else {
        console.error(kleur.red("Error: --permalink/-p requires a value"));
        process.exit(1);
      }
    } else if (arg.startsWith("-")) {
      console.error(kleur.red(`Unknown option: ${arg}`));
      process.exit(1);
    }
  }

  return { cliTitle, cliPermalink };
}

export async function create() {
  console.log(kleur.bold().blue("\nCreate new blog article\n"));

  // 1. 解析命令行参数
  const { cliTitle, cliPermalink } = parseArgs();

  // 2. 构建 prompts 问题数组（只询问缺失的字段）
  const questions = [];

  if (cliTitle === null) {
    questions.push({
      type: "text",
      name: "title",
      message: "What is the article title?",
      validate: (value) => (value.length < 1 ? "Title cannot be empty" : true),
    });
  }

  if (cliPermalink === null) {
    questions.push({
      type: "text",
      name: "permalink",
      message: "What is the permalink?",
      initial: (prev) => {
        const baseTitle = cliTitle || prev;
        if (baseTitle) {
          return baseTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
        }
        return "";
      },
      validate: (value) =>
        value.length < 1 ? "Permalink cannot be empty" : true,
    });
  }

  // 3. 如果有问题需要询问，则执行 prompts
  let answers = {};
  if (questions.length > 0) {
    try {
      answers = await prompts(questions);
    } catch (err) {
      // 用户取消（如 Ctrl+C）时 prompts 会抛出异常，优雅退出
      console.log(kleur.yellow("\nOperation cancelled"));
      return;
    }
  }

  // 4. 合并命令行参数和交互式答案
  const title = cliTitle !== null ? cliTitle : answers.title;
  const permalink = cliPermalink !== null ? cliPermalink : answers.permalink;

  if (!title || !permalink) {
    console.log(kleur.yellow("Operation stopped"));
    return;
  }

  // 5. 创建文件（原逻辑保持不变）
  const targetDir = path.join(process.cwd(), "src", "content", "articles");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = `${title}.md`;
  const filePath = path.join(targetDir, fileName);

  if (fs.existsSync(filePath)) {
    throw new Error(`File ${fileName} exists!`);
  }

  const dateStr = new Date().toISOString().split("T")[0];

  const content = `---
title: "${title}"
published: ${dateStr}
tags:
  - "Note"
draft: false
permalink: "${permalink}"
description: ""
pin: 0
---
`;

  fs.writeFileSync(filePath, content);

  console.log(
    kleur.green(
      `\n✅ Created File successfully: src/content/articles/${fileName}`,
    ),
  );
}
