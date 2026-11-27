/**
 * npm run migrate:create -- <name>
 *
 * Creates a Payload migration, then marks its type-only imports with `type`.
 * The Payload CLI runs here with --disable-transpile (Node strips TypeScript itself — the default
 * tsx loader crashes with "Illegal constructor" in undici), and Node only strips imports that are
 * written as types, so `import { MigrateUpArgs, ... }` must become `import { type MigrateUpArgs, ... }`.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "src", "migrations");
const TYPES = ["MigrateUpArgs", "MigrateDownArgs"];

const run = spawnSync(process.execPath, [path.join(root, "node_modules/payload/bin.js"), "migrate:create", "--disable-transpile", ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: root,
});
if (run.status !== 0) process.exit(run.status ?? 1);

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
  const p = path.join(dir, file);
  const src = fs.readFileSync(p, "utf8");
  const fixed = src.replace(/import \{([^}]*)\} from '@payloadcms\/db-postgres'/, (_, names) =>
    `import {${names
      .split(",")
      .map((n) => (TYPES.includes(n.trim()) ? n.replace(n.trim(), `type ${n.trim()}`) : n))
      .join(",")}} from '@payloadcms/db-postgres'`,
  );
  if (fixed !== src) {
    fs.writeFileSync(p, fixed);
    console.log(`[migrate:create] marked type imports in ${file}`);
  }
}
