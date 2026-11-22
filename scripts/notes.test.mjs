import { test } from "node:test";
import assert from "node:assert/strict";
import { noteEntries, versionOf } from "../docs/assets/notes.mjs";

test("splits one-paragraph-per-line notes and labels the lead-in", () => {
  const { entries, more } = noteEntries(
    "Auto-mark: choose Run first to put selected photos ahead.\n\nUpdated a URL-handling dependency to fix a crash.",
  );
  assert.deepEqual(entries, [
    { label: "Auto-mark", text: "Choose Run first to put selected photos ahead." },
    { label: "", text: "Updated a URL-handling dependency to fix a crash." },
  ]);
  assert.equal(more, false);
});

test("keeps section headings and strips bullets and Markdown", () => {
  const { entries } = noteEntries(
    "What's new\n\n- **Bold** item with [a link](https://example.com)\n\nFixes\n\n• `code` fix",
  );
  assert.deepEqual(entries, [
    { heading: "What's new" },
    { label: "", text: "Bold item with a link" },
    { heading: "Fixes" },
    { label: "", text: "code fix" },
  ]);
});

test("stops after the limit, reports more, and drops an empty trailing heading", () => {
  const body = ["## New", "- a", "- b", "## Fixed", "- c"].join("\n");
  const two = noteEntries(body, 2);
  assert.deepEqual(two.entries, [
    { heading: "New" },
    { label: "", text: "a" },
    { label: "", text: "b" },
  ]);
  assert.equal(two.more, false);
  const one = noteEntries(body, 1);
  assert.equal(one.entries.length, 2);
  assert.equal(one.more, true);
});

test("does not treat long sentences or arrows as labels", () => {
  const { entries } = noteEntries(
    "• View → Folder Stats shows scene coverage: kept and unmarked photos.",
  );
  assert.equal(entries[0].label, "");
});

test("handles empty bodies and tags", () => {
  assert.deepEqual(noteEntries(null), { entries: [], more: false });
  assert.equal(versionOf("app-v0.9.12"), "0.9.12");
  assert.equal(versionOf(undefined), "");
});
