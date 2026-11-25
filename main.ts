// One Line, One Laugh — make.fun bounty u-coral-404-one-line-one-laugh-22f2c9f3
// Writes exactly one funny line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR /
// $OUTPUT_DIR). The line is the whole entry: a single joke that lands on a
// cold read, no setup notes, no explanation.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, one laugh.
const LINE =
  "My bank called to ask if I was okay. I said no. They said, 'We know. That's why we're calling.'";

function main(): void {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  if (outDir === ".") {
    throw new Error("refusing output directory '.'");
  }

  // Validate the line against the gate: UTF-8 text, 1-200 characters,
  // not only white space, exactly one line, no control characters.
  // Count Unicode code points, not UTF-16 units: the gate counts characters.
  const charCount = [...LINE].length;
  if (charCount < 1 || charCount > 200) {
    throw new Error(`entry is ${charCount} characters, must be 1-200`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (/[\u0000-\u001f\u007f]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }

  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Round-trip check: what was written must be exactly the validated line.
  if (readFileSync(outPath, "utf8") !== LINE) {
    throw new Error("written entry.txt does not match the validated line");
  }
}

main();
