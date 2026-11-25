// make.fun — "One-Line Office Joke Laugh-Off" (u-suzy-one-line-office-joke-laugh-off-f574ac73)
//
// Entry: one original one-line joke about office life.
//
// The daily standup is the most universal office ritual — and the most
// honest joke about it is that nothing ever moves: fifteen people queue
// up to report the same non-progress, every single morning.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Our daily standup is fifteen people taking turns saying 'same as yesterday' for thirty minutes.";

// The gate: entry.txt must be UTF-8 text of 1 to 200 characters, not only
// whitespace — and the brief wants exactly one line, so no newline inside
// the joke and none trailing it.
if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.trim().length === 0) {
  throw new Error(`entry fails the 1–200 character gate (${ENTRY.length} chars)`);
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
