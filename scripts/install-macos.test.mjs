import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  existsSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const helper = resolve("install-macos.sh");
const mac = { skip: process.platform !== "darwin" };
function bash(code, args = []) {
  return spawnSync(
    "/bin/bash",
    ["-c", `source "$1"; shift; ${code}`, "test", helper, ...args],
    { encoding: "utf8" },
  );
}
function fixture(t) {
  const path = mkdtempSync(join(tmpdir(), "cullthing-helper-test-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
function release(overrides = {}) {
  return {
    draft: false,
    prerelease: false,
    tag_name: "app-v1.2.3",
    assets: [
      {
        name: "CullThing_1.2.3_aarch64.dmg",
        state: "uploaded",
        browser_download_url:
          "https://github.com/andrei930/cullthing-releases/releases/download/app-v1.2.3/CullThing_1.2.3_aarch64.dmg",
        digest: `sha256:${"ab".repeat(32)}`,
      },
    ],
    ...overrides,
  };
}
function json(dir, value) {
  const path = join(dir, "release.json");
  writeFileSync(path, JSON.stringify(value));
  return path;
}

test("helper is valid Bash and documents a non-mutating dry run", () => {
  const parsed = spawnSync("/bin/bash", ["-n", helper], { encoding: "utf8" });
  assert.equal(parsed.status, 0, parsed.stderr);
  const help = spawnSync("/bin/bash", [helper, "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0);
  assert.match(
    help.stdout,
    /without installing, changing quarantine, or launching/,
  );
});

test(
  "selects the exact official uploaded stable Apple Silicon DMG",
  mac,
  (t) => {
    const dir = fixture(t),
      path = json(dir, release());
    const result = bash(
      'ct_select_asset "$1" && printf "%s|%s|%s" "$ct_release_tag" "$ct_asset_name" "$ct_asset_sha"',
      [path],
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      result.stdout,
      `app-v1.2.3|CullThing_1.2.3_aarch64.dmg|${"ab".repeat(32)}`,
    );
  },
);

test(
  "rejects draft, prerelease, missing digest, wrong origin/version and unfinished assets",
  mac,
  (t) => {
    const dir = fixture(t);
    const invalid = [
      release({ draft: true }),
      release({ prerelease: true }),
      release({ tag_name: "app-v1.2.3-rc.1" }),
      release({ assets: [] }),
    ];
    for (const patch of [
      { digest: null },
      { digest: "sha256:abc" },
      { browser_download_url: "https://example.com/CullThing.dmg" },
      {
        browser_download_url:
          "https://github.com/andrei930/cullthing-releases/releases/download/app-v0.0.1/CullThing_1.2.3_aarch64.dmg",
      },
      { state: "new" },
      { name: "CullThing_1.2.3_x64.dmg" },
    ])
      invalid.push(release({ assets: [{ ...release().assets[0], ...patch }] }));
    for (const value of invalid) {
      const result = bash('ct_select_asset "$1"', [json(dir, value)]);
      assert.notEqual(result.status, 0, JSON.stringify(value));
      assert.match(result.stderr, /CullThing:/);
    }
  },
);

test(
  "accepts the expected SHA-256 and refuses a modified download",
  mac,
  (t) => {
    const dir = fixture(t),
      path = join(dir, "download.dmg"),
      bytes = "official fixture";
    writeFileSync(path, bytes);
    const digest = createHash("sha256").update(bytes).digest("hex");
    assert.equal(
      bash('ct_verify_file "$1" "$2"', [path, digest.toUpperCase()]).status,
      0,
    );
    writeFileSync(path, bytes + " changed");
    const result = bash('ct_verify_file "$1" "$2"', [path, digest]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /failed its SHA-256 check/);
  },
);

test(
  "stages a replacement, scopes quarantine to that copy, and cleans temporary files",
  mac,
  (t) => {
    const dir = fixture(t),
      source = join(dir, "source.app"),
      destination = join(dir, "CullThing.app"),
      log = join(dir, "scope");
    mkdirSync(source);
    mkdirSync(destination);
    writeFileSync(join(source, "version"), "new");
    writeFileSync(join(destination, "version"), "old");
    const result = bash(
      'ct_scope_log="$3"; ct_remove_quarantine() { printf "%s" "$1" > "$ct_scope_log"; }; ct_install_bundle "$1" "$2"',
      [source, destination, log],
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(destination, "version"), "utf8"), "new");
    const scope = readFileSync(log, "utf8");
    assert.ok(scope.startsWith(join(dir, ".CullThing-install.")));
    assert.ok(scope.endsWith("/CullThing.app"));
    assert.ok(!existsSync(scope));
    assert.ok(
      !readdirSync(dir).some((name) => name.startsWith(".CullThing-install.")),
    );
  },
);

test("restores the old app if publishing the staged copy fails", mac, (t) => {
  const dir = fixture(t),
    source = join(dir, "source.app"),
    destination = join(dir, "CullThing.app");
  mkdirSync(source);
  mkdirSync(destination);
  writeFileSync(join(source, "version"), "new");
  writeFileSync(join(destination, "version"), "old");
  const result = bash(
    'ct_remove_quarantine() { :; }; ct_test_destination="$2"; ct_move() { if [[ "$1" == */CullThing.app && "$2" == "$ct_test_destination" ]]; then return 1; fi; /bin/mv "$1" "$2"; }; ct_install_bundle "$1" "$2"',
    [source, destination],
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /previous installation was restored/);
  assert.equal(readFileSync(join(destination, "version"), "utf8"), "old");
  assert.ok(
    !readdirSync(dir).some((name) => name.startsWith(".CullThing-install.")),
  );
});

test("refuses destination symlinks before touching their targets", mac, (t) => {
  const dir = fixture(t),
    source = join(dir, "source.app"),
    target = join(dir, "other.app"),
    destination = join(dir, "CullThing.app");
  mkdirSync(source);
  mkdirSync(target);
  writeFileSync(join(target, "keep"), "unchanged");
  symlinkSync(target, destination);
  const result = bash('ct_install_bundle "$1" "$2"', [source, destination]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symlink/);
  assert.equal(readFileSync(join(target, "keep"), "utf8"), "unchanged");
});

test(
  "a staging failure leaves the installed app intact and removes its temporary files",
  mac,
  (t) => {
    for (const failure of ["copy", "quarantine"]) {
      const dir = fixture(t),
        source = join(dir, "source.app"),
        destination = join(dir, "CullThing.app");
      mkdirSync(source);
      mkdirSync(destination);
      writeFileSync(join(destination, "version"), "old");
      const override =
        failure === "copy"
          ? "ct_copy() { return 1; };"
          : "ct_remove_quarantine() { return 1; };";
      const result = bash(`${override} ct_install_bundle "$1" "$2"`, [
        source,
        destination,
      ]);
      assert.notEqual(result.status, 0);
      assert.equal(readFileSync(join(destination, "version"), "utf8"), "old");
      assert.ok(
        !readdirSync(dir).some((name) =>
          name.startsWith(".CullThing-install."),
        ),
      );
    }
  },
);

test(
  "preserves and reports the previous app when rollback itself fails",
  mac,
  (t) => {
    const dir = fixture(t),
      source = join(dir, "source.app"),
      destination = join(dir, "CullThing.app");
    mkdirSync(source);
    mkdirSync(destination);
    writeFileSync(join(source, "version"), "new");
    writeFileSync(join(destination, "version"), "old");
    const result = bash(
      'ct_remove_quarantine() { :; }; ct_test_destination="$2"; ct_move() { if [[ "$2" == "$ct_test_destination" ]]; then return 1; fi; /bin/mv "$1" "$2"; }; ct_install_bundle "$1" "$2"',
      [source, destination],
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /previous app is preserved at/);
    const stage = readdirSync(dir).find((name) =>
      name.startsWith(".CullThing-install."),
    );
    assert.ok(stage);
    assert.equal(
      readFileSync(
        join(dir, stage, "PreviousCullThing.app", "version"),
        "utf8",
      ),
      "old",
    );
  },
);

test(
  "removes quarantine recursively on a disposable fixture and preserves other attributes",
  mac,
  (t) => {
    const dir = fixture(t),
      bundle = join(dir, "fixture.app");
    mkdirSync(bundle);
    const path = join(bundle, "payload");
    writeFileSync(path, "test");
    for (const file of [bundle, path]) {
      assert.equal(
        spawnSync("/usr/bin/xattr", [
          "-w",
          "com.apple.quarantine",
          "0081;00000000;CullThingInstallerTest;",
          file,
        ]).status,
        0,
      );
      assert.equal(
        spawnSync("/usr/bin/xattr", ["-w", "com.cullthing.test", "keep", file])
          .status,
        0,
      );
    }
    const result = bash('ct_remove_quarantine "$1"', [bundle]);
    assert.equal(result.status, 0, result.stderr);
    for (const file of [bundle, path]) {
      assert.notEqual(
        spawnSync("/usr/bin/xattr", ["-p", "com.apple.quarantine", file])
          .status,
        0,
      );
      assert.equal(
        spawnSync("/usr/bin/xattr", ["-p", "com.cullthing.test", file], {
          encoding: "utf8",
        }).stdout.trim(),
        "keep",
      );
    }
    assert.equal(
      bash('ct_remove_quarantine "$1"', [bundle]).status,
      0,
      "also succeeds when quarantine is already absent",
    );
  },
);

test(
  "a failed first installation does not claim to have restored a previous app",
  mac,
  (t) => {
    const dir = fixture(t),
      source = join(dir, "source.app"),
      destination = join(dir, "CullThing.app");
    mkdirSync(source);
    const result = bash(
      'ct_remove_quarantine() { :; }; ct_move() { return 1; }; ct_install_bundle "$1" "$2"',
      [source, destination],
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Try again or use the DMG installer/);
    assert.doesNotMatch(result.stderr, /previous installation was restored/);
    assert.equal(existsSync(destination), false);
    assert.ok(
      !readdirSync(dir).some((name) => name.startsWith(".CullThing-install.")),
    );
  },
);
