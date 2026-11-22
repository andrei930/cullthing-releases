# Public README and website

The application source remains in the private CullThing repository. This public repository contains only distribution materials and the static website.

- Website: https://andrei930.github.io/cullthing-releases/
- GitHub Pages source: `main`, `/docs`, using **Deploy from a branch**.
- All website assets are committed under `docs/`. No build, package installation, secrets, custom domain, paid runners, backend, analytics, or third-party hosting are required.
- The README's platform links use `docs/download/`. It looks up GitHub's latest published stable release, chooses the `.dmg` or `x64-setup.exe`, and redirects to the official GitHub asset. The home page also resolves these buttons directly. No version strings need updating on each release.
- If the API is rate-limited, offline, or missing an installer, visitors get the stable GitHub release-page fallback. JavaScript-disabled browsers can use that link too.
- Screenshots show the real application frontend with illustrative mock data, captured on 2026-11-22. Sample photos come from [Lorem Picsum](https://picsum.photos/); no user library or private application source is published.
- Keep the installation warnings in sync with the actual signing/notarization status of published builds.
- Check download selection with `node --test scripts/releases.test.mjs`. To inspect the site locally, serve `docs/` with any static HTTP server; no compilation is needed.

## Hosting cost

GitHub Pages is included for public repositories on GitHub Free. This site uses the included `github.io` address and branch publishing. It does not enable any paid product or register a domain. Pages usage limits can lead to rate limiting or a request to reduce usage, rather than a metered hosting bill. Large installers stay in GitHub Releases, not in the Pages site.

References: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
