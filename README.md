# CullThing

CullThing is a desktop photo-culling application designed to make reviewing
large photo shoots faster. It works directly with folders containing RAW and
common image files and provides:

- grid, scene, and single-image review workflows;
- fast keyboard and mouse navigation;
- star ratings, color labels, and pick/reject flags;
- filtering and sorting for narrowing down a shoot;
- face detection and focus assessment; and
- XMP sidecar support so culling metadata stays alongside the photographs.

CullThing is currently proprietary software distributed for limited testing.
This public repository contains its official compiled installers and signed
update artifacts. It intentionally does not contain the application's source
code, and its public visibility does not grant an open-source license.

## Supported platforms

- macOS on Apple Silicon (`aarch64`)
- Windows on 64-bit Intel/AMD (`x86_64`)

Intel Macs are not currently supported.

## Downloading CullThing

Use the newest published entry on the
[Releases](https://github.com/andrei930/cullthing-releases/releases) page:

- On macOS, download the `.dmg` file.
- On Windows, download the `x64-setup.exe` file.

Files ending in `.app.tar.gz`, `.sig`, and `latest.json` are used by the
in-app updater and should not be downloaded for a normal installation. Draft
releases are still being tested and are not offered to installed applications.

Only install CullThing from this repository or from a link supplied directly
by the developer.

## Installing on macOS

The current macOS build is ad-hoc signed but is not yet notarized by Apple.
Consequently, macOS shows a warning the first time CullThing is installed.

1. Open the downloaded `.dmg` file.
2. Drag **CullThing** into the **Applications** folder, then eject the disk
   image.
3. Open CullThing from **Applications**.
4. If macOS says that `CullThing.app` was not opened, click **Done**. Do not
   click **Move to Trash**.
5. Open **System Settings**, select **Privacy & Security**, and scroll down to
   the **Security** section.
6. Click **Open Anyway** beside the message about CullThing, authenticate, and
   confirm **Open**.

The **Open Anyway** button is available for about an hour after a blocked
launch attempt. After this approval, macOS saves CullThing as an exception and
it can be opened normally. See
[Apple's official instructions](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac)
for more information.

If the button is not present, try opening CullThing from **Applications** once
more and immediately return to **Privacy & Security**. As a last-resort
fallback, remove the quarantine attribute from this specific installation:

```bash
xattr -dr com.apple.quarantine /Applications/CullThing.app
```

Only use either override when CullThing was downloaded from this official
repository or received directly from the developer.

## Installing on Windows

The current Windows build is not Authenticode-signed. If Microsoft Defender
SmartScreen displays a warning, select **More info**, verify that the app is
CullThing, and choose **Run anyway**. The installer operates for the current
Windows user and does not require a system-wide installation.

## Updates

Updater-enabled versions of CullThing check this repository for newer
published releases. CullThing displays an in-app prompt before downloading and
installing an update, and it relaunches after installation. A manual
**Check for Updates** command is also available from the application menu.

The updater validates a separate cryptographic signature before accepting an
update. This protects the update channel from modified or unauthorized
artifacts, but it is independent of Apple notarization and Microsoft
Authenticode signing. Draft releases are never offered through the updater.

## Licensing

CullThing itself is proprietary and all rights are reserved. Third-party
components remain governed by their own licenses and notices. See
[PROPRIETARY-NOTICE.md](PROPRIETARY-NOTICE.md) and
[RAWLER-LGPL-WRITTEN-OFFER.md](RAWLER-LGPL-WRITTEN-OFFER.md).

Requests for the LGPL materials described in the written offer can be made
through the repository's [Issues](https://github.com/andrei930/cullthing-releases/issues)
page. The LGPL offer covers the applicable `rawler` materials and relinking
support; it does not make CullThing's proprietary source code open source.
