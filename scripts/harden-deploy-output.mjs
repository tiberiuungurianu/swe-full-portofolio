import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const outputRoots = [".next/server", ".next/static"];
const textExtensions = new Set([".js", ".css", ".html", ".mjs", ".cjs"]);
const sourceMappingUrl =
  /(?:\/\/[#@]\s*sourceMappingURL=\S+|\/\*[#@]\s*sourceMappingURL=\S+\*\/)/g;

function walk(directory, onFile) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "dev" || entry.name === "cache") continue;
      walk(fullPath, onFile);
      continue;
    }
    if (entry.isFile()) onFile(fullPath);
  }
}

let removedMaps = 0;
let strippedReferences = 0;

for (const root of outputRoots) {
  walk(root, (filePath) => {
    if (filePath.endsWith(".map")) {
      rmSync(filePath);
      removedMaps += 1;
      return;
    }

    const extension = path.extname(filePath);
    if (!textExtensions.has(extension)) return;
    if (statSync(filePath).size > 5_000_000) return;

    const source = readFileSync(filePath, "utf8");
    if (!source.includes("sourceMappingURL")) return;
    const next = source.replace(sourceMappingUrl, "");
    if (next !== source) {
      writeFileSync(filePath, next);
      strippedReferences += 1;
    }
  });
}

console.log(
  `harden-deploy-output: removed ${removedMaps} source map file(s), stripped ${strippedReferences} sourceMappingURL reference(s).`,
);
