import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const failures = [];

function fail(rule, message) {
  failures.push(`[${rule}] ${message}`);
}

const browserRoots = [".next/static", "public"];
const outputRoots = [".next/server", ".next/static", "public"];
const textExtensions = new Set([
  ".js",
  ".css",
  ".html",
  ".json",
  ".txt",
  ".svg",
  ".xml",
  ".mjs",
  ".cjs",
  ".map",
]);

const forbiddenPath = (relativePath) => {
  const normalized = relativePath.replaceAll("\\", "/");
  if (normalized.includes("/.git/") || normalized.startsWith(".git/")) {
    return "Git metadata";
  }
  if (normalized.includes("/internal/") || normalized.startsWith("internal/")) {
    return "internal documentation";
  }
  if (normalized.endsWith("deployment-privacy-rules.md")) {
    return "internal policy document";
  }
  if (/(^|\/)\.env($|\.)/.test(normalized)) return "environment file";
  if (normalized.endsWith(".log") || normalized.includes("/logs/")) return "log file";
  if (normalized.includes("/coverage/")) return "test coverage output";
  if (
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".test.tsx") ||
    normalized.endsWith(".spec.ts") ||
    normalized.endsWith(".spec.tsx") ||
    normalized.includes("/__tests__/")
  ) {
    return "test file";
  }
  if (normalized.endsWith("guestbook.json")) return "local guestbook data";
  if (/\.(tsx|ts)$/.test(normalized) && !normalized.endsWith(".d.ts")) {
    return "TypeScript source";
  }
  return null;
};

function walk(directory, onFile) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (entry.name === "dev" || entry.name === "cache") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, onFile);
      continue;
    }
    if (entry.isFile()) onFile(fullPath);
  }
}

function readText(filePath) {
  if (statSync(filePath).size > 5_000_000) return null;
  const extension = path.extname(filePath);
  if (!textExtensions.has(extension)) return null;
  return readFileSync(filePath, "utf8");
}

function loadSecretValues() {
  const secrets = new Map();
  const publicKeys = [];
  const files = [".env", ".env.local", ".env.production", ".env.production.local"];

  const consider = (key, rawValue) => {
    const value = rawValue.trim().replace(/^['"]|['"]$/g, "");
    if (!value || value.length < 16) return;
    if (key.startsWith("NEXT_PUBLIC_")) {
      publicKeys.push(key);
      return;
    }
    if (!/SECRET|TOKEN|PASSWORD|PRIVATE|CREDENTIAL/i.test(key)) return;
    secrets.set(key, value);
  };

  for (const filePath of files) {
    if (!existsSync(filePath)) continue;
    for (const line of readFileSync(filePath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      consider(trimmed.slice(0, separator).trim(), trimmed.slice(separator + 1));
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") consider(key, value);
  }

  return { secrets, publicKeys };
}

if (!existsSync(".next/BUILD_ID")) {
  fail(
    "production-output",
    "Production output is missing (.next/BUILD_ID). Run npm run build before verify:deploy.",
  );
}

if (existsSync("public/internal") || existsSync("public/deployment-privacy-rules.md")) {
  fail(
    "internal-docs",
    "internal/deployment-privacy-rules.md or public/internal would be served as a static file.",
  );
}

for (const root of outputRoots) {
  walk(root, (filePath) => {
    const relativePath = path.relative(process.cwd(), filePath);
    if (filePath.endsWith(".map")) {
      fail("source-maps", `${relativePath} is a source map and must not be deployed.`);
    }
    const reason = forbiddenPath(relativePath);
    if (reason) {
      fail("unpublished-files", `${relativePath} is ${reason} and must not be deployed.`);
    }
  });
}

const { secrets, publicKeys } = loadSecretValues();

for (const root of outputRoots) {
  walk(root, (filePath) => {
    const text = readText(filePath);
    if (text == null) return;
    const relativePath = path.relative(process.cwd(), filePath);

    if (text.includes("sourceMappingURL")) {
      fail(
        "source-maps",
        `${relativePath} still references a source map (sourceMappingURL).`,
      );
    }

    for (const [key, value] of secrets) {
      if (text.includes(value)) {
        fail(
          "secrets",
          `${relativePath} contains the value of ${key}. The value is not printed.`,
        );
      }
    }
  });
}

const devUrl = /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?/i;
const localPath = /(?:\/Users\/|\/home\/[^/\s"'`]+|[A-Za-z]:\\Users\\)/;
const internalNote = /LOCAL \/ DEV|portfolio handover|deployment-privacy-rules/;

for (const root of browserRoots) {
  walk(root, (filePath) => {
    const text = readText(filePath);
    if (text == null) return;
    const relativePath = path.relative(process.cwd(), filePath);

    if (localPath.test(text)) {
      fail(
        "local-path",
        `${relativePath} contains an absolute local filesystem path.`,
      );
    }
    if (devUrl.test(text)) {
      fail("dev-url", `${relativePath} contains a development URL.`);
    }
    if (internalNote.test(text)) {
      fail(
        "internal-note",
        `${relativePath} contains an internal development note.`,
      );
    }
    if (text.includes("GUESTBOOK_MODERATION_SECRET")) {
      fail(
        "secrets",
        `${relativePath} is a browser asset and names GUESTBOOK_MODERATION_SECRET.`,
      );
    }
  });
}

function looksUnminified(text) {
  if (text.length < 8 * 1024) return false;
  const lines = text.split("\n");
  if (lines.length < 40) return false;
  const average = text.length / lines.length;
  return average < 120;
}

for (const root of [".next/static", ".next/server"]) {
  walk(root, (filePath) => {
    if (path.basename(filePath) === "[turbopack]_runtime.js") return;
    const extension = path.extname(filePath);
    if (extension !== ".js" && extension !== ".css") return;
    const text = readText(filePath);
    if (text == null || !looksUnminified(text)) return;
    const relativePath = path.relative(process.cwd(), filePath);
    fail(
      "minify",
      `${relativePath} looks unminified (${text.split("\n").length} lines). Production JS and CSS must be minified.`,
    );
  });
}

if (existsSync(".next/required-server-files.json")) {
  const builtConfig = JSON.parse(
    readFileSync(".next/required-server-files.json", "utf8"),
  );
  const config = builtConfig.config ?? {};
  if (config.productionBrowserSourceMaps === true) {
    fail(
      "source-maps",
      "The production build enabled productionBrowserSourceMaps.",
    );
  }
  if (config.experimental?.serverSourceMaps === true) {
    fail("source-maps", "The production build enabled experimental.serverSourceMaps.");
  }
  if (config.experimental?.serverMinification === false) {
    fail("minify", "The production build disabled experimental.serverMinification.");
  }
}

if (failures.length > 0) {
  console.error("verify:deploy failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const publicConfig =
  publicKeys.length > 0 ? publicKeys.join(", ") : "none (no NEXT_PUBLIC_ variables)";

console.log("verify:deploy passed");
console.log("Checked .next/server, .next/static, and public.");
console.log(`Public client configuration: ${publicConfig}.`);
console.log(
  "Server-only: GUESTBOOK_MODERATION_SECRET is checked as a value, not printed.",
);
