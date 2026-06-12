import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.join(__dirname, "..");
const indexPath = path.join(projectDir, "extension", "index.js");

const LOAD_LOCALLY_TRUE = "const LOAD_LOCALLY = true;";
const LOAD_LOCALLY_FALSE = "const LOAD_LOCALLY = false;";

function setLoadLocally(value) {
  if (!fs.existsSync(indexPath)) {
    console.error("buildExtension: extension/index.js not found");
    process.exit(1);
  }

  const source = fs.readFileSync(indexPath, "utf8");
  const from = value ? LOAD_LOCALLY_FALSE : LOAD_LOCALLY_TRUE;
  const to = value ? LOAD_LOCALLY_TRUE : LOAD_LOCALLY_FALSE;

  if (!source.includes(from)) {
    if (source.includes(to)) {
      console.log(`buildExtension: LOAD_LOCALLY already set to ${value}`);
      return;
    }
    console.error(
      "buildExtension: expected LOAD_LOCALLY pattern not found in index.js",
    );
    process.exit(1);
  }

  fs.writeFileSync(indexPath, source.replace(from, to), "utf8");
  console.log(`buildExtension: LOAD_LOCALLY → ${value}`);
}

let failed = false;

try {
  // Build the actions first
  execFileSync("tsx", ["scripts/build.ts"], {
    cwd: projectDir,
    stdio: "inherit",
  });

  // Set LOAD_LOCALLY to false
  setLoadLocally(false);

  // Package the extension
  execFileSync("node", ["scripts/packageExtension.mjs"], {
    cwd: projectDir,
    stdio: "inherit",
  });
} catch (error) {
  failed = true;
  console.error("buildExtension: failed");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
} finally {
  try {
    // Restore LOAD_LOCALLY to true
    setLoadLocally(true);
  } catch {
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
