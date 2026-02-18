#!/usr/bin/env node
import { create } from "../scripts/create.mjs";
import { deploy } from "../scripts/deploy.mjs";
import { dev } from "../scripts/dev.mjs";
import { preview } from "../scripts/preview.mjs";
import { build } from "../scripts/build.mjs";
import kleur from "kleur";

const args = process.argv.slice(2);
const command = args[0];

// 简单的命令路由
const commands = {
  create: create,
  dev: dev,
  build: build,
  preview: preview,
  deploy: deploy,
  // update: updateTheme,
  help: showHelp,
};

async function main() {
  if (commands[command]) {
    try {
      await commands[command]();
    } catch (error) {
      console.error(kleur.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  } else {
    showHelp();
  }
}

function showHelp() {
  console.log(`
${kleur.bold().magenta("🌸 Haku Theme CLI")}

Usage:
  ${kleur.cyan("haku create")}     create a new blog article
  ${kleur.cyan("haku dev")}        start local dev server
  ${kleur.cyan("haku build")}      build the site for production
  ${kleur.cyan("haku preview")}    preview the production build locally
  ${kleur.cyan("haku deploy")}     deploy to remote repository
  ${kleur.cyan("haku help")}       show this help message
`);
}

main();
