import { test } from "node:test";
import assert from "node:assert/strict";
import {
  installerFor,
  latestRelease,
  REPOSITORY,
} from "../docs/assets/releases.mjs";
const names = [
  "CullThing_0.9.11_aarch64.app.tar.gz",
  "CullThing_0.9.11_aarch64.dmg",
  "CullThing_0.9.11_x64-setup.exe",
  "CullThing_0.9.11_x64-setup.exe.sig",
  "latest.json",
];
const fixture = () => ({
  tag_name: "app-v0.9.11",
  draft: false,
  prerelease: false,
  assets: names.map((name) => ({
    name,
    state: "uploaded",
    browser_download_url: `https://github.com/${REPOSITORY}/releases/download/app-v0.9.11/${name}`,
  })),
});
test("selects installers, never updater archives or signatures", () => {
  const release = fixture();
  assert.ok(installerFor(release, "macos").endsWith("_aarch64.dmg"));
  assert.ok(installerFor(release, "windows").endsWith("_x64-setup.exe"));
});
test("does not serve drafts, prereleases, missing platforms, or incomplete assets", () => {
  for (const patch of [
    { draft: true },
    { prerelease: true },
    { assets: [] },
    { assets: null },
  ])
    assert.equal(installerFor({ ...fixture(), ...patch }, "macos"), null);
  assert.equal(installerFor(fixture(), "arm64"), null);
  assert.equal(installerFor(fixture(), "__proto__"), null);
  assert.equal(installerFor(null, "macos"), null);
  const release = fixture();
  release.assets[1].state = "new";
  assert.equal(installerFor(release, "macos"), null);
});
test("only accepts exact official asset URLs for the current release", () => {
  for (const url of [
    "https://example.com/installer.dmg",
    "javascript:alert(1)",
    `https://github.com/another/repo/releases/download/app-v0.9.11/${names[1]}`,
    `https://github.com/${REPOSITORY}/releases/download/app-v0.9.10/${names[1]}`,
  ]) {
    const release = fixture();
    release.assets[1].browser_download_url = url;
    assert.equal(installerFor(release, "macos"), null);
  }
});
test("fetches the latest public release without credentials and handles API failure", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(
      url,
      `https://api.github.com/repos/${REPOSITORY}/releases/latest`,
    );
    assert.equal(options.credentials, "omit");
    return { ok: true, json: async () => fixture() };
  });
  assert.equal((await latestRelease()).tag_name, "app-v0.9.11");
  globalThis.fetch.mock.mockImplementation(async () => ({ ok: false }));
  await assert.rejects(latestRelease(), /unavailable/);
});
