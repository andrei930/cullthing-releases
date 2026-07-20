# CullThing releases

This public repository contains official compiled installers and signed update
artifacts for **CullThing**, a proprietary desktop photo-culling application.
It intentionally does not contain the application's source code and its public
visibility does not grant an open-source license.

## Downloads

Use the latest published entry on the
[Releases](https://github.com/andrei930/cullthing-releases/releases) page.
Draft releases are still being tested and are not offered to installed
applications.

The initial builds are not notarized by Apple or code-signed for Microsoft
SmartScreen. On macOS, the first installation may require the documented
Gatekeeper override. On Windows, SmartScreen may require the user to choose
**More info** and **Run anyway**. The in-app updater uses a separate
cryptographic signature to reject modified or unauthorized updates.

## Licensing

CullThing itself is proprietary and all rights are reserved. Third-party
components remain governed by their own licenses. See
[PROPRIETARY-NOTICE.md](PROPRIETARY-NOTICE.md) and
[RAWLER-LGPL-WRITTEN-OFFER.md](RAWLER-LGPL-WRITTEN-OFFER.md).

Requests for the LGPL materials described in the written offer can be made
through the repository's **Issues** tab.
