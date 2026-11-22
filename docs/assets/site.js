import { installerFor, latestRelease } from "./releases.mjs";

// Relative download-page links remain usable if GitHub's API is unavailable.
latestRelease()
  .then((release) => {
    document.querySelectorAll("[data-download]").forEach((link) => {
      const url = installerFor(release, link.dataset.download);
      if (url) link.href = url;
    });
    if (installerFor(release, "macos") || installerFor(release, "windows")) {
      const note = document.querySelector("[data-release-note]");
      if (note)
        note.textContent = `${release.name || release.tag_name} · Latest stable release`;
    }
  })
  .catch(() => {});

function showInstallSteps() {
  if (!["#install-macos", "#install-windows"].includes(location.hash)) return;
  const details = document.querySelector(location.hash);
  if (details) {
    details.open = true;
    details.scrollIntoView();
  }
}
window.addEventListener("hashchange", showInstallSteps);
showInstallSteps();
