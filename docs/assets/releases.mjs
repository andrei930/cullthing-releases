export const REPOSITORY = "andrei930/cullthing-releases";
export const LATEST_RELEASE = `https://github.com/${REPOSITORY}/releases/latest`;
const patterns = {
  macos: /^CullThing_[\d.]+_aarch64\.dmg$/,
  windows: /^CullThing_[\d.]+_x64-setup\.exe$/,
};

export function installerFor(release, platform) {
  if (
    !Object.hasOwn(patterns, platform) ||
    release?.draft !== false ||
    release?.prerelease !== false ||
    !Array.isArray(release.assets)
  )
    return null;
  const asset = release.assets.find(
    (asset) =>
      asset.state === "uploaded" && patterns[platform].test(asset.name),
  );
  if (!asset) return null;
  try {
    const url = new URL(asset.browser_download_url);
    const expectedPath = `/${REPOSITORY}/releases/download/${encodeURIComponent(release.tag_name)}/${asset.name}`;
    return url.origin === "https://github.com" &&
      url.pathname === expectedPath &&
      !url.search &&
      !url.hash
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export async function latestRelease() {
  const response = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/releases/latest`,
    {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
      credentials: "omit",
    },
  );
  if (!response.ok) throw new Error("Release lookup unavailable");
  return response.json();
}
