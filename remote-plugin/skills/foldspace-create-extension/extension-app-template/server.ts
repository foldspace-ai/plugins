import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

const app = express();
const PORT = process.env.PORT || 3007;

// Serve static files from dist directory
app.use("/dist", express.static(distDir));

// List all available agent bundles
app.get("/", (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Foldspace Extension Actions</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .agent-list { list-style: none; padding: 0; }
        .agent-list li { padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 4px; }
        .agent-list a { color: #0066cc; text-decoration: none; }
        .agent-list a:hover { text-decoration: underline; }
        code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>Foldspace Extension Actions</h1>
      <p>Available agent bundles:</p>
      <ul class="agent-list">
  `;

  // Scan dist directory for bundles
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);

    for (const file of files) {
      if (file.endsWith(".js")) {
        const agentPath = `/dist/${file}`;
        html += `<li><a href="${agentPath}">${file}</a></li>\n`;
      }
    }
  } else {
    html += `<li>No builds found. Run <code>npm run build</code> first.</li>`;
  }

  html += `
      </ul>
      <hr>
      <p><small>Run <code>npm run build</code> to compile agents</small></p>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`\nFoldspace extension server running at http://localhost:${PORT}`);
  console.log(`Serving dist/ directory\n`);
});
