import { spawn } from "child_process";

export function runAstro(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["astro", ...args], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`astro ${args[0]} exited with code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to run astro build: ${err.message}`));
    });
  });
}
