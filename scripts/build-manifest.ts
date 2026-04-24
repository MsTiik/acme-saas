import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

const manifest = { changes: {} };

writeFileSync(
  join(outDir, "probe.manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log("wrote public/probe.manifest.json");
