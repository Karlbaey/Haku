import kleur from "kleur";
import { runAstro } from "./astro.mjs";
import { existsSync } from "fs";
import { join } from "path";
export async function preview() {
  // 检查 dist 目录是否存在，提示用户先构建
  const distPath = join(process.cwd(), "dist");
  if (!existsSync(distPath)) {
    console.warn(
      kleur.yellow(
        "\n⚠️  No dist/ folder found. Did you run `haku build` first?\n",
      ),
    );
  }
  console.log(kleur.cyan("\n🔍 Starting Haku preview server...\n"));
  await runAstro(["preview"]);
}
