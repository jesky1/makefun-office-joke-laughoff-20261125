import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = fileURLToPath(new URL(".", import.meta.url));

const EXPECTED =
  "Our daily standup is fifteen people taking turns saying 'same as yesterday' for thirty minutes.";

function runOnce() {
  const outDir = mkdtempSync(join(tmpdir(), "office-joke-laughoff-"));
  const r = spawnSync(process.execPath, ["main.ts"], {
    cwd: repoDir,
    env: { ...process.env, OUTPUT_DIR: outDir },
    encoding: "utf8",
  });
  assert.equal(r.status, 0, `main.ts exited ${r.status}: ${r.stderr}`);
  const entry = readFileSync(join(outDir, "entry.txt"), "utf8");
  rmSync(outDir, { recursive: true, force: true });
  return entry;
}

test("entry is the one-line office joke", () => {
  const entry = runOnce();
  assert.equal(entry, EXPECTED);
  assert.ok(!entry.includes("\n"), "must be a single line");
  assert.ok(entry.trim().length > 0, "must not be only whitespace");
});

test("entry passes the 1–200 character gate", () => {
  const entry = runOnce();
  assert.ok(entry.length >= 1 && entry.length <= 200, `${entry.length} chars`);
  assert.equal(entry.length, 95, "joke is 95 characters");
});

test("output is deterministic across runs", () => {
  const a = runOnce();
  const b = runOnce();
  const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex");
  assert.equal(sha(a), sha(b));
  assert.equal(sha(a), createHash("sha256").update(EXPECTED, "utf8").digest("hex"));
});
