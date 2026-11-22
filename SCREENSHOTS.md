# Screenshot inventory

Captured on 2026-11-22 from the actual frontend in isolated demo mode. No private library is used. Names, analysis scores, EXIF, project progress, and Lightroom changes are illustrative demo data. Remove and Expand screenshots show instructions awaiting Lightroom generation, not generated results. All current screenshots use neutral names.

## Make the workspace yours.

- [A filmstrip beside the photograph](docs/assets/review-filmstrip-left.png): Keep neighboring frames in a vertical filmstrip, with the floating rating and flag bar and separate navigation buttons within reach.
- [A filmstrip below the photograph](docs/assets/review-filmstrip-bottom.png): Switch to a horizontal filmstrip. This view has the floating action bar and navigation buttons switched off, leaving the image clear.
- [Review one scene at a time](docs/assets/review-scenes.png): The scene navigator groups the shoot into moments; the neighboring strip shows the frames in the selected scene. Move between moments without losing your place.
- [Faces, focus, eyes, and the shot details](docs/assets/review-faces-info.png): Inspect the magnified face panel, the focus score, and eye status together. The info panel on the opposite side shows ratings, labels, camera, lens, exposure, and capture information. Eye status appears after Analyze Eyes.
- [Put each panel where it works for you](docs/assets/workspace-settings.png): Dock the filmstrip left, right, or along the bottom. Move the scene navigator, face panel, and info panel to either side; show or hide floating action and navigation controls.
- [Let the photograph fill the view](docs/assets/review-clean.png): Hide the filmstrip and panels, switch off the floating controls, and hide the interface bars. Top and status bars can also auto-hide and reappear at the screen edge.

## A closer pass on the details.

- [A workspace built for marking distractions](docs/assets/remove-mode.png): Brush, select, copy, paste, and group Remove marks while the filmstrip stays available. Adjust brush size, scroll resize speed, and overlay opacity; touching marks can become one removal automatically.
- [Pan, brush, and erase without hunting for tools](docs/assets/remove-controls.png): Switch between Pan, Add, and Erase, or stay in Pan and use the configured modifiers to brush and erase. Resize with the wheel, pinch, or shortcuts. The in-app guide explains selection and grouping; modifiers are configurable.
- [Frame the shot before the handoff](docs/assets/crop-mode.png): Use aspect presets, lock the ratio, flip the orientation, and drag the crop handles with a composition grid. Apply the crop to XMP without replacing the original photo.
- [Level the frame with room to fine-tune](docs/assets/straighten-mode.png): Use Straighten for an automatic angle, adjust the Level slider yourself, and reset the crop and angle independently. The example shows a demo angle with the crop kept inside the rotated photo.
- [Give the photograph more room](docs/assets/generative-expand.png): Extend the frame beyond the original boundaries with Generative Expand. CullThing prepares a DNG copy; use Update AI Settings in Lightroom to generate the added edges. The white border shown here is the area awaiting generation.

## A profile, a project, a little feedback.

- [Choose where your look comes from](docs/assets/editthing-profile-choices.png): Instant starts with a Lightroom preset and nine taste questions. Personal learns from your edited catalogs or RAW + XMP folders. If you are unsure, EditThing can inspect your edited photos and recommend a profile type.
- [Keep each shoot and its progress together](docs/assets/editthing-projects.png): See the profile assigned to each project and which shoots are drafts, paused, or done. Open a project to continue editing; pause and resume work when you need to.
- [Edit in Lightroom. Confirm what EditThing finds.](docs/assets/editthing-lightroom-feedback.png): While the trial panel is open, EditThing watches the trial edits. With the Lightroom plug-in connected, it reads the changes without a separate XMP save. Consistent changes are preselected; mixed changes stay unchecked. Review the detected shifts, then confirm Save as adjustments and rewrite. This screen uses illustrative demo changes.
