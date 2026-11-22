import { installerFor, latestRelease } from "./releases.mjs";
import { noteEntries, versionOf } from "./notes.mjs";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Replace the hand-written notes when a newer release than the page's is out. */
function showNotes(release) {
  const list = document.querySelector("[data-release-notes]");
  if (!list || list.dataset.releaseTag === release.tag_name) return;
  const { entries, more } = noteEntries(release.body);
  if (!entries.length) return;
  list.replaceChildren(
    ...entries.map((entry) => {
      if ("heading" in entry) {
        const li = document.createElement("li");
        li.className = "notes-heading";
        li.textContent = entry.heading;
        return li;
      }
      const li = document.createElement("li");
      if (entry.label) {
        const b = document.createElement("b");
        b.textContent = `${entry.label}. `;
        li.append(b);
      }
      li.append(entry.text);
      return li;
    }),
  );
  list.dataset.releaseTag = release.tag_name;
  const full = document.querySelector("[data-release-link]");
  if (full && more) {
    full.textContent = "Full release notes →";
    full.href = "https://github.com/andrei930/cullthing-releases/releases/latest";
  }
}

// Published installer links work even if the latest-release lookup fails.
latestRelease()
  .then((release) => {
    const mac = installerFor(release, "macos");
    const windows = installerFor(release, "windows");
    if (!mac && !windows) return;
    document.querySelectorAll("[data-download]").forEach((link) => {
      const url = installerFor(release, link.dataset.download);
      if (url) link.href = url;
    });
    const version = versionOf(release.tag_name);
    document
      .querySelectorAll("[data-release-version]")
      .forEach((el) => (el.textContent = version));
    const published = new Date(release.published_at);
    if (!Number.isNaN(published.valueOf()))
      document
        .querySelectorAll("[data-release-date]")
        .forEach((el) => {
          el.textContent = dateFormat.format(published);
          el.dateTime = release.published_at;
        });
    showNotes(release);
  })
  .catch(() => {});

const copyInstall = document.querySelector("[data-copy-install]");
if (copyInstall && navigator.clipboard?.writeText) {
  copyInstall.hidden = false;
  copyInstall.addEventListener("click", async () => {
    const command = document.querySelector("#mac-install-command");
    const status = document.querySelector("[data-copy-status]");
    try {
      await navigator.clipboard.writeText(command.textContent.trim());
      status.textContent = "Copied. Paste it into Terminal and press Return.";
    } catch {
      status.textContent = "Select the command above and copy it.";
    }
  });
}
