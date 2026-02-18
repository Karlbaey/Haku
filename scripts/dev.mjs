import { runAstro } from "./astro.mjs";
import kleur from "kleur";

export async function dev() {
  console.log(kleur.cyan("\n🚀 Starting Haku dev server...\n"));
  await runAstro(["dev"]);
}
