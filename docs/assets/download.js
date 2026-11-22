import { installerFor, latestRelease } from "./releases.mjs";

const platform = new URLSearchParams(location.search).get("platform");
const status = document.querySelector("#download-status");
if (["macos", "windows"].includes(platform)) {
  const label = platform === "macos" ? "Mac" : "Windows";
  document.title = `Download CullThing for ${label}`;
  document.querySelector("#install-help").href = `../#install-${platform}`;
  status.textContent = `Finding the latest CullThing installer for ${label}…`;
  latestRelease()
    .then((release) => {
      const url = installerFor(release, platform);
      if (!url) throw new Error("Installer unavailable");
      const link = document.querySelector("#installer");
      link.href = url;
      link.textContent = `Download for ${label}`;
      link.hidden = false;
      status.textContent = `Your download should start shortly. If it does not, use the download button below.`;
      location.assign(url);
    })
    .catch(() => {
      status.textContent = `We could not look up the latest installer. Open the latest release on GitHub below and choose the ${platform === "macos" ? ".dmg" : "x64-setup.exe"} file.`;
    });
}
