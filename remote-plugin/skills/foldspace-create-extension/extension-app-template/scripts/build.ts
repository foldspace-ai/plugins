import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(__dirname, "..");
const distDir = path.join(projectDir, "dist");
const agentActionsEntry = path.join(projectDir, "agent", "actions", "index.ts");

const watchMode = process.argv.includes("--watch");

function buildOptions(): esbuild.BuildOptions {
  return {
    entryPoints: [agentActionsEntry],
    outfile: path.join(distDir, "index.js"),
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2022",
    minify: true,
    sourcemap: false,
  };
}

function rebuildPlugin(): esbuild.Plugin {
  return {
    name: "rebuild-notify",
    setup(build) {
      build.onEnd((result) => {
        const time = new Date().toLocaleTimeString();
        if (result.errors.length === 0) {
          console.log(`[${time}] Rebuilt: dist/index.js`);
        } else {
          console.log(`[${time}] Error: dist/index.js`);
        }
      });
    },
  };
}

async function build() {
  console.log(`Building agent actions...\n`);

  if (!fs.existsSync(agentActionsEntry)) {
    console.error(`Entry point not found: ${agentActionsEntry}`);
    process.exit(1);
  }

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    if (watchMode) {
      console.log("Watch mode — watching for changes...\n");

      const context = await esbuild.context({
        ...buildOptions(),
        plugins: [rebuildPlugin()],
      });

      await context.watch();
      console.log("Initial build complete! Watching for changes...\n");

      process.on("SIGINT", async () => {
        console.log("\nStopping watcher...");
        await context.dispose();
        process.exit(0);
      });
    } else {
      await esbuild.build(buildOptions());
      console.log("Built: dist/index.js");
      console.log("\nBuild complete!");
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
