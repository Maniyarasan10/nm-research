/**
 * PDF Scraper — NM Research
 * ---------------------------------------------------------------
 * Downloads the per-subject "Detailed Theory & Case Studies" PDFs
 * from https://nmresearch.co.in/ (pattern: pdfs/<slug>-detailed.pdf)
 * into the local app so they can be served offline at
 * /nm-research/pdfs/<slug>-detailed.pdf
 *
 * Usage:
 *   node scripts/scrape-pdfs.mjs [--dry-run]
 *
 * The subject list is read from `src/data/site.ts` (the app's own
 * Research index) and each subject name is slugified to match the
 * source site's naming convention. No existing app structure is
 * changed — PDFs are only added to public/pdfs/.
 */
import { readFileSync, existsSync, mkdirSync, createWriteStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE_TS = join(ROOT, "src", "data", "site.ts");
const OUT_DIR = join(ROOT, "public", "pdfs");
const SOURCE = "https://nmresearch.co.in/pdfs";
const DRY_RUN = process.argv.includes("--dry-run");

function slugify(name) {
  return name
    .toLowerCase()
    // drop anything in parentheses, e.g. "Internet of Things (IoT)"
    .replace(/\([^)]*\)/g, "")
    // separators -> dash
    .replace(/[&+/.,·#]+/g, "-")
    // any run of non-alphanumeric -> dash
    .replace(/[^a-z0-9]+/g, "-")
    // tidy
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

// --- Extract subjects from site.ts (kept in sync with the app index) ---
const src = readFileSync(SITE_TS, "utf8");
const subjects = [];
// collect the strings inside each subjects: [ ... ] block
const blocks = src.match(/subjects:\s*\[([\s\S]*?)\]/g) ?? [];
for (const block of blocks) {
  const names = block.matchAll(/"([^"]+)"/g);
  for (const m of names) subjects.push(m[1]);
}

const unique = [...new Set(subjects)];
console.log(`Found ${subjects.length} subject entries (${unique.length} unique) in site.ts`);

mkdirSync(OUT_DIR, { recursive: true });

let ok = 0;
let failed = [];

for (const name of unique) {
  const slug = slugify(name);
  const url = `${SOURCE}/${slug}-detailed.pdf`;
  const dest = join(OUT_DIR, `${slug}-detailed.pdf`);

  if (existsSync(dest)) {
    console.log(`skip  (exists)  ${slug}-detailed.pdf`);
    ok++;
    continue;
  }

  if (DRY_RUN) {
    console.log(`dry   ${name.padEnd(34)} -> ${slug}-detailed.pdf`);
    continue;
  }

  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok || !res.headers.get("content-type")?.includes("pdf")) {
      failed.push({ name, slug, status: res.status });
      console.log(`FAIL  ${name.padEnd(34)} -> ${url} [${res.status}]`);
      continue;
    }
    const bytes = await res.arrayBuffer();
    await pipeline(Readable.from(Buffer.from(bytes)), createWriteStream(dest));
    ok++;
    console.log(`ok    ${name.padEnd(34)} -> ${slug}-detailed.pdf (${bytes.byteLength} bytes)`);
  } catch (e) {
    failed.push({ name, slug, status: "ERR" });
    console.log(`ERR   ${name.padEnd(34)} -> ${e.message}`);
  }
}

console.log("\n===== DONE =====");
console.log(`Downloaded/ok: ${ok}   Failed: ${failed.length}`);
if (failed.length) {
  console.log("\nFailed (may need manual mapping):");
  for (const f of failed) {
    console.log(`  - ${f.name}  (${f.slug})  [${f.status}]`);
  }
}
