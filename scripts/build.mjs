import { runAstro } from "./astro.mjs";
import kleur from "kleur";

export async function build() {
  console.log(kleur.yellow("\n📦 Building Haku site...\n"));
  await runAstro(["build"]);
  console.log(kleur.green("\n✅ Build complete!\n"));
}
