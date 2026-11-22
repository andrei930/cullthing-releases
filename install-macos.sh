#!/bin/bash
# CullThing's optional installer for official, not-yet-notarized test builds.
# Uses only tools shipped with macOS. Does not change Gatekeeper globally.

ct_error() { printf 'CullThing: %s\n' "$*" >&2; return 1; }
ct_json() { /usr/bin/plutil -extract "$2" raw -o - "$1" 2>/dev/null; }
ct_copy() { /usr/bin/ditto "$1" "$2"; }
ct_move() { /bin/mv "$1" "$2"; }
ct_remove_quarantine() { /usr/bin/xattr -dr com.apple.quarantine "$1"; }

ct_select_asset() {
  local ct_json_path="$1" ct_count ct_index ct_name ct_state ct_url ct_digest
  [[ "$(ct_json "$ct_json_path" draft)" == false && "$(ct_json "$ct_json_path" prerelease)" == false ]] || { ct_error 'The release is not a published stable build.'; return 1; }
  ct_release_tag="$(ct_json "$ct_json_path" tag_name)"
  [[ "$ct_release_tag" =~ ^app-v[0-9]+\.[0-9]+\.[0-9]+$ ]] || { ct_error 'Unexpected release tag.'; return 1; }
  ct_count="$(ct_json "$ct_json_path" assets)"
  [[ "$ct_count" =~ ^[0-9]+$ && "$ct_count" -le 500 ]] || { ct_error 'Invalid release asset list.'; return 1; }
  ct_index=0
  while [[ "$ct_index" -lt "$ct_count" ]]; do
    ct_name="$(ct_json "$ct_json_path" "assets.$ct_index.name")"
    ct_state="$(ct_json "$ct_json_path" "assets.$ct_index.state")"
    if [[ "$ct_name" == "CullThing_${ct_release_tag#app-v}_aarch64.dmg" && "$ct_state" == uploaded ]]; then
      ct_url="$(ct_json "$ct_json_path" "assets.$ct_index.browser_download_url")"
      ct_digest="$(ct_json "$ct_json_path" "assets.$ct_index.digest")"
      [[ "$ct_url" == "https://github.com/andrei930/cullthing-releases/releases/download/$ct_release_tag/$ct_name" ]] || { ct_error 'The installer URL is not an official CullThing asset.'; return 1; }
      [[ "$ct_digest" =~ ^sha256:[0-9a-fA-F]{64}$ ]] || { ct_error 'This release does not have a usable SHA-256 checksum. Use the normal DMG download.'; return 1; }
      ct_asset_url="$ct_url"
      ct_asset_sha="${ct_digest#sha256:}"
      ct_asset_name="$ct_name"
      return 0
    fi
    ct_index=$((ct_index + 1))
  done
  ct_error 'No Apple Silicon DMG was found in the latest stable release.'
}

ct_verify_file() {
  local ct_actual ct_expected
  ct_actual="$(/usr/bin/shasum -a 256 "$1" | /usr/bin/awk '{print $1}')"
  ct_expected="$(printf '%s' "$2" | /usr/bin/tr 'A-F' 'a-f')"
  [[ "$ct_actual" == "$ct_expected" ]] || { ct_error 'The downloaded installer failed its SHA-256 check. Nothing was installed.'; return 1; }
}

ct_validate_bundle() {
  local ct_bundle="$1" ct_bundle_id
  [[ -d "$ct_bundle" && ! -L "$ct_bundle" ]] || { ct_error 'The disk image does not contain CullThing.app.'; return 1; }
  ct_bundle_id="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$ct_bundle/Contents/Info.plist" 2>/dev/null)"
  [[ "$ct_bundle_id" == com.andrei.cullthing ]] || { ct_error 'The app has an unexpected bundle identifier.'; return 1; }
  /usr/bin/codesign --verify --deep --strict "$ct_bundle" || { ct_error 'The app failed its code-signature integrity check.'; return 1; }
}

# Stage beside the destination, then replace it with an atomic move. Restore
# the previous installation if publishing the staged copy fails.
ct_install_bundle() (
  set -euo pipefail
  ct_source="$1" ct_destination="$2" ct_parent='' ct_stage='' ct_keep_stage=0 ct_previous=0
  ct_parent="$(/usr/bin/dirname "$ct_destination")"
  [[ ! -L "$ct_destination" ]] || { ct_error 'Refusing to replace an application symlink.'; exit 1; }
  [[ ! -e "$ct_destination" || -d "$ct_destination" ]] || { ct_error 'The destination exists and is not an application folder.'; exit 1; }
  ct_stage="$(/usr/bin/mktemp -d "$ct_parent/.CullThing-install.XXXXXX")"
  trap 'if [[ "$ct_keep_stage" == 0 ]]; then /bin/rm -rf "$ct_stage"; fi' EXIT
  ct_copy "$ct_source" "$ct_stage/CullThing.app"
  # Only the verified copy being installed is changed; no system policy changes.
  ct_remove_quarantine "$ct_stage/CullThing.app"
  if [[ -e "$ct_destination" ]]; then
    ct_move "$ct_destination" "$ct_stage/PreviousCullThing.app"
    ct_previous=1
  fi
  if ! ct_move "$ct_stage/CullThing.app" "$ct_destination"; then
    if [[ "$ct_previous" == 1 ]] && ! ct_move "$ct_stage/PreviousCullThing.app" "$ct_destination"; then
      ct_keep_stage=1
      ct_error "The previous app is preserved at $ct_stage/PreviousCullThing.app. Restore it before trying again."
      exit 1
    fi
    if [[ "$ct_previous" == 1 ]]; then
      ct_error 'The new app could not be installed. The previous installation was restored.'
    else
      ct_error 'CullThing could not be installed. Try again or use the DMG installer.'
    fi
    exit 1
  fi
)

ct_main() (
  set -euo pipefail
  ct_dry_run=0 ct_open=1 ct_tmp='' ct_mounted=0 ct_parent='' ct_destination='' ct_version='' ct_major=0 ct_minor=0
  while [[ "$#" -gt 0 ]]; do
    case "$1" in
      --dry-run) ct_dry_run=1 ;;
      --no-open) ct_open=0 ;;
      --help) printf 'Usage: bash install-macos.sh [--dry-run] [--no-open]\n--dry-run downloads and verifies the app without installing, changing quarantine, or launching it.\n'; exit 0 ;;
      *) ct_error "Unknown option: $1"; exit 1 ;;
    esac
    shift
  done
  [[ "$(/usr/bin/uname -s)" == Darwin ]] || { ct_error 'This installer is for macOS only.'; exit 1; }
  [[ "$EUID" -ne 0 ]] || { ct_error 'Run this as your normal user, without sudo.'; exit 1; }
  [[ "$(/usr/bin/uname -m)" == arm64 || "$(/usr/sbin/sysctl -n hw.optional.arm64 2>/dev/null || true)" == 1 ]] || { ct_error 'CullThing currently requires an Apple Silicon Mac.'; exit 1; }
  ct_version="$(/usr/bin/sw_vers -productVersion)"
  IFS=. read -r ct_major ct_minor _ <<< "$ct_version"
  [[ "$ct_major" -gt 13 || ( "$ct_major" -eq 13 && "${ct_minor:-0}" -ge 4 ) ]] || { ct_error 'CullThing requires macOS 13.4 or later.'; exit 1; }
  ct_parent=/Applications
  if [[ ! -w "$ct_parent" ]]; then ct_parent="$HOME/Applications"; fi
  ct_destination="$ct_parent/CullThing.app"
  ct_tmp="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/cullthing-install.XXXXXX")"
  trap 'if [[ "$ct_mounted" == 1 ]]; then /usr/bin/hdiutil detach "$ct_tmp/mounted" -quiet || true; fi; /bin/rm -rf "$ct_tmp"' EXIT
  printf 'CullThing installer\nOfficial builds: https://github.com/andrei930/cullthing-releases\n\n'
  printf 'Fetching the latest stable release…\n'
  /usr/bin/curl --fail --silent --show-error --location --proto '=https' --retry 2 --connect-timeout 20 --max-time 60 -H 'Accept: application/vnd.github+json' 'https://api.github.com/repos/andrei930/cullthing-releases/releases/latest' -o "$ct_tmp/release.json"
  ct_select_asset "$ct_tmp/release.json"
  printf 'Downloading %s…\n' "$ct_asset_name"
  /usr/bin/curl --fail --show-error --location --proto '=https' --retry 2 --connect-timeout 20 --max-time 900 "$ct_asset_url" -o "$ct_tmp/CullThing.dmg"
  ct_verify_file "$ct_tmp/CullThing.dmg" "$ct_asset_sha"
  printf 'SHA-256 verified. Checking the app…\n'
  /bin/mkdir "$ct_tmp/mounted"
  /usr/bin/hdiutil attach -quiet -nobrowse -readonly -mountpoint "$ct_tmp/mounted" "$ct_tmp/CullThing.dmg"
  ct_mounted=1
  ct_validate_bundle "$ct_tmp/mounted/CullThing.app"
  if [[ "$ct_dry_run" == 1 ]]; then
    printf 'Verified %s. Would install to %s. Dry run: nothing installed, no quarantine changed, no app launched.\n' "$ct_release_tag" "$ct_destination"
    exit 0
  fi
  if /usr/bin/pgrep -f "$ct_destination/Contents/MacOS/" >/dev/null 2>&1; then
    ct_error 'CullThing is running. Quit it before updating, then run this installer again.'
    exit 1
  fi
  /bin/mkdir -p "$ct_parent"
  printf '\nThis test build is not Apple-notarized. Removing quarantine only from the verified CullThing copy being installed.\n'
  ct_install_bundle "$ct_tmp/mounted/CullThing.app" "$ct_destination"
  printf '\nInstalled %s to %s\n' "$ct_release_tag" "$ct_destination"
  if [[ "$ct_open" == 1 ]]; then /usr/bin/open "$ct_destination"; fi
)

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  ct_main "$@"
fi
