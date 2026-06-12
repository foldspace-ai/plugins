import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.join(__dirname, "..");
const projectName = path.basename(projectDir);
const extensionDir = path.join(projectDir, "extension");
const zipPath = path.join(projectDir, `${projectName}-extension.zip`);

if (!fs.existsSync(extensionDir)) {
  console.error("packageExtension: extension/ directory not found");
  process.exit(1);
}

try {
  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath);
  }
  execFileSync("zip", ["-r", zipPath, "."], {
    cwd: extensionDir,
    stdio: "inherit",
  });
  console.log(`packageExtension: created ${zipPath}`);
} catch {
  console.error("packageExtension: failed to create extension.zip");
  process.exit(1);
}
