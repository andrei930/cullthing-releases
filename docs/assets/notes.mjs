/**
 * Turn a GitHub release body into short "What's new" entries.
 *
 * Release notes are written as bullets or one paragraph per line, sometimes
 * under headings such as "What's new" or "Fixes". Each entry is plain text
 * (Markdown is stripped) so the page can render it with textContent only.
 */
const HEADING =
  /^(what['’]s new|new|improved|improvements|fixes|fixed|changes)$/i;

function plain(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/**
 * @returns {{ entries: Array<{ heading: string } | { label: string, text: string }>, more: boolean }}
 */
export function noteEntries(body, max = 6) {
  const entries = [];
  let items = 0;
  let more = false;
  for (const raw of String(body ?? "").split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    const isHeading = line.startsWith("#");
    line = plain(line.replace(/^#+\s*/, "").replace(/^([-*•]|\d+\.)\s+/, ""));
    if (!line) continue;
    if (isHeading || HEADING.test(line.replace(/:$/, ""))) {
      if (items >= max) break;
      entries.push({ heading: line.replace(/:$/, "") });
      continue;
    }
    if (items >= max) {
      more = true;
      break;
    }
    const labelled = /^([^:.]{2,32}):\s+(.+)$/.exec(line);
    entries.push(
      labelled
        ? {
            label: labelled[1],
            text: labelled[2][0].toUpperCase() + labelled[2].slice(1),
          }
        : { label: "", text: line },
    );
    items += 1;
  }
  while (entries.length && "heading" in entries.at(-1)) entries.pop();
  return { entries, more };
}

/** "app-v0.9.12" → "0.9.12" */
export function versionOf(tag) {
  return String(tag ?? "").replace(/^app-v/, "");
}
