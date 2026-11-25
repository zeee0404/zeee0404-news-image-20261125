// main.ts — entry program for news-image-20261125.
//
// The front page is rendered by draw.mjs and shipped in this repository as
// entry.png. This program copies that image into the output directory, so
// both graded runs write identical bytes. It uses the standard library only:
// no network and no extra packages.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const targetPath = join(outDir, "entry.png");

if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
  throw new Error(`entry.png is missing next to main.ts (${sourcePath})`);
}

const png = readFileSync(sourcePath);
if (png.length > 1048576) {
  throw new Error(`entry.png is ${png.length} bytes, over the 1 MiB limit`);
}

// A PNG starts with a fixed 8-byte signature, then the IHDR chunk, whose
// width and height sit at fixed offsets. Check those before trusting them.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png does not start with a PNG signature");
}
if (png.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png has no IHDR chunk where one belongs");
}
if (png.readUInt32BE(16) !== 1024 || png.readUInt32BE(20) !== 1024) {
  throw new Error("entry.png is not 1024x1024");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

// Confirm the copy landed byte for byte before reporting success: first
// the length, so a truncated write is caught at a glance, then the hash.
const written = readFileSync(targetPath);
if (written.length !== png.length) {
  throw new Error(
    `copied entry.png is ${written.length} bytes, expected ${png.length}`,
  );
}
const sourceSha = createHash("sha256").update(png).digest("hex");
const sha = createHash("sha256").update(written).digest("hex");
if (sha !== sourceSha) {
  throw new Error("copied entry.png does not match the repository image");
}
console.log(`wrote ${targetPath} (${written.length} bytes, sha256 ${sha})`);
