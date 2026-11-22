# Public README and website

The application source remains in the private CullThing repository. This public repository contains only distribution materials and the static website.

- Website: https://andrei930.github.io/cullthing-releases/
- GitHub Pages source: `main`, `/docs`, using **Deploy from a branch**.
- All website assets are committed under `docs/`. No build, package installation, secrets, custom domain, paid runners, backend, analytics, or third-party hosting are required.
- The README and home page link directly to the published Mac `.dmg` and Windows `x64-setup.exe`. Keep downloads above the first screenshot. When publishing a new stable release, update these static asset URLs and the displayed release version in `README.md` and `docs/index.html`; verify both files are uploaded first.
- The home page also refreshes all `data-download` links from the latest release API. If JavaScript or that API is unavailable, the static download links still work. The optional `docs/download/` route resolves the latest installers too, with a link to the GitHub release page if lookup fails.
- Screenshots show the real application frontend with illustrative mock data, captured on 2026-11-22. Sample photos come from [Lorem Picsum](https://picsum.photos/) and [Unsplash](https://unsplash.com/); no user library or private application source is published.
- The visual tour has three independent keyboard-accessible tab groups. Without JavaScript, all screenshots remain visible. Screenshots are static images without click-to-open actions. See [SCREENSHOTS.md](SCREENSHOTS.md) for capture intent and demo-data notes.
- Keep the installation warnings in sync with the actual signing/notarization status of published builds.
- Check downloads and the Mac helper with `node --test scripts/*.test.mjs` and `shellcheck install-macos.sh`. Run `bash install-macos.sh --dry-run` on macOS for the real download, checksum, mount, and app integrity checks without installing or changing quarantine. To inspect the site locally, serve `docs/` with any static HTTP server; no compilation is needed.

## Hosting cost

GitHub Pages is included for public repositories on GitHub Free. This site uses the included `github.io` address and branch publishing. It does not enable any paid product or register a domain. Pages usage limits can lead to rate limiting or a request to reduce usage, rather than a metered hosting bill. Large installers stay in GitHub Releases, not in the Pages site.

References: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Optional Mac installer

`install-macos.sh` uses built-in macOS tools and the official latest stable release API. Keep the exact asset-name, official URL, uploaded-state, digest, bundle-identity and signature-integrity checks. Never weaken them for a missing checksum. It stages the app beside its destination, changes quarantine only on that verified copy, and restores the previous installation on a failed replacement. It never changes system Gatekeeper policy or uses sudo. Test replacements, scoped quarantine handling, and rollback using disposable fixtures; do not install over a developer’s app to test it. Update the helper and these instructions when Apple notarization becomes available.
