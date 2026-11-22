# Screenshot inventory

## Website captures (2026-11-22)

The home page uses WebP copies in `docs/assets/web/`. They were captured from the actual frontend in isolated mock mode, seeded with a made-up wedding shoot: 39 sample photos, two camera bodies, illustrative ratings, labels, focus scores and capture times. The capture harness lived only in a local checkout and is not published.

| File | Shows |
| --- | --- |
| `grid.webp` | Grid view of the sample wedding (hero) |
| `scenes.webp` | Scenes view with the seven-frame burst selected |
| `scene-settings.webp` | Scene Settings dialog |
| `faces.webp` | Face panel with focus score and eye status, info panel |
| `automark-modal.webp` | Auto-mark dialog with categories and objects |
| `remove-suggest.webp` | Remove mode with auto-mark suggestions on wires and string lights. The suggestion strokes were placed by hand along the wires for the mock; real results come from the detector |
| `capture-align.webp` | Align Timelines with two camera lanes, the second clock off by 3 min 42 s |
| `shortcuts.webp`, `mouse.webp` | Shortcut editor and mouse settings |
| `layout.webp` | Animation: panels resized by dragging, then hidden |
| `crop-mode-desktop.webp`, `straighten-mode-desktop.webp`, `generative-expand-desktop.webp`, `editthing-profile-choices.webp` | WebP copies of the earlier captures below |

The seven-frame burst of the couple walking was generated with an image model (GPT image generation via Codex) so the Scenes view has realistic near-identical frames; the website caption says so. Other sample photos: Unsplash (`photo-1515934751635-c81c6bc9a2d8`, `photo-1525258946800-98cfd641d0de`, `photo-1519741497674-611481863552`, `photo-1519225421980-715cb0215aed`, `photo-1522673607200-164d1b6ce486`, `photo-1511285560929-80b456fea0bc`, `photo-1465495976277-4387d4b0b4c6`, `photo-1532712938310-34cb3982ef74`, `photo-1537633552985-df8429e8048b`, `photo-1541250848049-b4f7141dca3f`, `photo-1520854221256-17451cc331bf`, `photo-1494790108377-be9c29b29330`, `photo-1500648767791-00dcc994a43e`, `photo-1531746020798-e6953c6e8e04`, `photo-1534528741775-53994a69daeb`, `photo-1544005313-94ddf0286df2`, `photo-1438761681033-6461ffad8d80`, `photo-1507003211169-0a1dd7228f2d`, `photo-1488426862026-3ee34a7d66df`, `photo-1506794778202-cad84cf45f1d`, `photo-1529626455594-4ff0802cfb7e`, `photo-1508214751196-bcfd4ca60f91`, `photo-1539571696357-5a69c17a67c6`, `photo-1503185912284-5271ff81b9a8`, `photo-1502685104226-ee32379fefbe`, `photo-1583939003579-730e3918a45a`, `photo-1606216794074-735e91aa2c92`) and Lorem Picsum ([325](https://picsum.photos/id/325/info), [129](https://picsum.photos/id/129/info), [399](https://picsum.photos/id/399/info), [65](https://picsum.photos/id/65/info), [351](https://picsum.photos/id/351/info)), used under the Unsplash License.

## Earlier captures (README)

Captured on 2026-11-22 from the actual frontend in isolated demo mode. No private library is used. Names, analysis scores, EXIF, project progress, and Lightroom changes are illustrative demo data. Remove and Expand screenshots show instructions awaiting Lightroom generation, not generated results. All current screenshots use neutral names. The grid and filmstrips use 24 distinct source photos, one per demo file. The Lightroom trial uses 10 distinct source photos. A selected photograph naturally appears both as the main image and its thumbnail; scene representatives also refer to their actual frames.

## Make the workspace yours.

- [A filmstrip beside the photograph](docs/assets/review-filmstrip-left-desktop.png): Keep neighboring frames in a vertical filmstrip, with the floating rating and flag bar centered beneath the photograph. Floating navigation arrows are off for this desktop layout.
- [A filmstrip below the photograph](docs/assets/review-filmstrip-bottom-desktop.png): Switch to a horizontal filmstrip. This view has the floating action bar and navigation buttons switched off, leaving the image clear.
- [Review one scene at a time](docs/assets/review-scenes-desktop.png): The scene navigator groups the shoot into moments; the neighboring strip shows the frames in the selected scene. Move between moments without losing your place.
- [Faces, focus, eyes, and the shot details](docs/assets/review-faces-info-desktop.png): Inspect the magnified face panel, the focus score, and eye status together. The info panel on the opposite side shows ratings, labels, camera, lens, exposure, and capture information. Eye status appears after Analyze Eyes.
- [Put each panel where it works for you](docs/assets/workspace-settings-desktop.png): Dock the filmstrip left, right, or along the bottom. Move the scene navigator, face panel, and info panel to either side. Center the floating action bar or hide it; navigation arrows can be enabled when using a tablet.
- [Let the photograph fill the view](docs/assets/review-clean.png): Hide the filmstrip and panels, switch off the floating controls, and hide the interface bars. Top and status bars can also auto-hide and reappear at the screen edge.

## A closer pass on the details.

- [A workspace built for marking distractions](docs/assets/remove-mode-desktop.png): Brush, select, copy, paste, and group Remove marks while the filmstrip stays available. Adjust brush size, scroll resize speed, and overlay opacity; touching marks can become one removal automatically.
- [Pan, brush, and erase without hunting for tools](docs/assets/remove-controls-desktop.png): Switch between Pan, Add, and Erase, or stay in Pan and use the configured modifiers to brush and erase. Resize with the wheel, pinch, or shortcuts. The in-app guide explains selection and grouping; modifiers are configurable.
- [Frame the shot before the handoff](docs/assets/crop-mode-desktop.png): Use aspect presets, lock the ratio, flip the orientation, and drag the crop handles with a composition grid. Apply the crop to XMP without replacing the original photo.
- [Level the frame with room to fine-tune](docs/assets/straighten-mode-desktop.png): Use Straighten for an automatic angle, adjust the Level slider yourself, and reset the crop and angle independently. The example shows a demo angle with the crop kept inside the rotated photo.
- [Give the photograph more room](docs/assets/generative-expand-desktop.png): Extend the frame beyond the original boundaries with Generative Expand. CullThing prepares a DNG copy; use Update AI Settings in Lightroom to generate the added edges. The white border shown here is the area awaiting generation.

## A profile, a project, a little feedback.

- [Choose where your look comes from](docs/assets/editthing-profile-choices.png): Instant starts with a Lightroom preset and nine taste questions. Personal learns from your edited catalogs or RAW + XMP folders. If you are unsure, EditThing can inspect your edited photos and recommend a profile type.
- [Keep each shoot and its progress together](docs/assets/editthing-projects.png): See the profile assigned to each project and which shoots are drafts, paused, or done. Open a project to continue editing; pause and resume work when you need to.
- [Edit in Lightroom. Confirm what EditThing finds.](docs/assets/editthing-lightroom-feedback-varied.png): While the trial panel is open, EditThing watches the trial edits. With the Lightroom plug-in connected, it reads the changes without a separate XMP save. Consistent changes are preselected; mixed changes stay unchecked. Review the detected shifts, then confirm Save as adjustments and rewrite. This screen uses illustrative demo changes.

## Presentation and photo credits

Desktop captures use the Autumn Collection label, a centered floating action bar, and no floating navigation arrows. The bottom filmstrip example hides the action bar. Developer-only demo badges are hidden for these presentation captures; the sample-data disclosure remains in the README and website. All screenshot images are static on the website.

Sample photographs: [Lorem Picsum](https://picsum.photos/) and [Unsplash](https://unsplash.com/). The replacement studio portrait is [this Unsplash image](https://images.unsplash.com/photo-1534528741775-53994a69daeb). These are sample photos and illustrative metadata, not a private client shoot.
