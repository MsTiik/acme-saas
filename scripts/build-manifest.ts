import { writeFileSync, mkdirSync, readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

// Scan all source files for changeId="..." patterns
function scanDir(dir: string): string[] {
  const ids: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (entry === "node_modules" || entry === ".next" || entry === "scripts") continue;
        ids.push(...scanDir(fullPath));
      } else if ([".tsx", ".ts", ".jsx", ".js"].includes(extname(entry))) {
        const src = readFileSync(fullPath, "utf-8");
        const matches = src.matchAll(/changeId=["']([^"']+)["']/g);
        for (const m of matches) ids.push(m[1]);
      }
    }
  } catch {
    // skip unreadable dirs
  }
  return ids;
}

const allIds = [...new Set(scanDir(process.cwd()))].sort();

const manifest = {
  version: "1",
  generatedAt: new Date().toISOString(),
  changes: Object.fromEntries(allIds.map((id) => [id, { id }])),
};

writeFileSync(join(outDir, "probe.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`wrote public/probe.manifest.json — ${allIds.length} changeIds:`, allIds.join(", "));
