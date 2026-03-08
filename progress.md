Original prompt: PLEASE IMPLEMENT THIS PLAN: migrate the app from R3F overview + Pannellum panoramas to a single R3F 3D house tour with shared housePlan data, procedural room scenes, neighbor-only navigation, info hotspots, and UI-only CTA.

- 2026-03-08: Confirmed current app uses Pannellum panoramas and hardcoded overview geometry. Build passes before refactor.
- 2026-03-08: Planned refactor to shared `housePlan`, procedural room scenes, app state cleanup, and responsive UI updates.
- 2026-03-08: Replaced panorama flow with a shared `housePlan`, data-driven overview, procedural `RoomScene`, HTML hotspots, loading/error overlays, and CTA success state.
- 2026-03-08: Removed runtime dependency on Pannellum and `panoramaUrl`; room interiors are now generated in-browser with R3F primitives.
- 2026-03-08: Verified `npm run build` passes after refactor. Vite still reports the pre-existing `three-mesh-bvh` / `BatchedMesh` warning and a large chunk warning.
- 2026-03-08: Verified overview opens 3D rooms via Playwright client and confirmed `Living Room -> Kitchen` neighbor navigation in a direct Playwright script. Artifacts saved under `output/`.
- 2026-03-08: Switched room scenes to an isometric cutaway view and rebalanced palette/lighting so overview and room shots read clearly without the previous white washout.
- 2026-03-08: Adjusted isometric room entry framing, enabled zoom on OrbitControls, and grounded suspended fixtures/furniture placements for a more coherent composition.
- 2026-03-08: Began migrating the planner from a fixed room-tour model to an editable `floors -> rooms -> doors/windows/objects` house model. Seeded multi-floor data with classic color swatches, room/floor creation helpers, and object definitions in `src/data/housePlan.js`.
- 2026-03-08: Rebuilt the app shell into a left-inspector editor with house/room view switching, persistent selection state, color editing, room resizing, object movement nudges, room creation, and floor creation. Removed the old quote CTA flow.
- 2026-03-08: Replaced the overview with a stacked transparent house view and replaced the room scene with a selectable cutaway editor scene including door navigation, window/door/object picking, and inspector-driven edits.
- 2026-03-08: Fixed room hit-testing so transparent ceiling geometry no longer blocks object selection. Verified with Playwright that clicking a room object selects it (`living-sofa`), door navigation reaches `kitchen`, room edits persist, room count increases from 7 to 8 after add-room, and floor count increases from 2 to 3 after add-floor.
- 2026-03-08: `npm run build` passes after the planner rewrite. Vite still reports the pre-existing `three-mesh-bvh` / `BatchedMesh` warning and large chunk warning.
- 2026-03-08: Additional Playwright verification artifacts saved under `output/planner-house/`, `output/planner-room-view/`, and `output/planner-e2e/`. The scripted E2E run completed without console or page errors.

TODO / handoff:
- Consider adding explicit code-splitting for the large room-scene bundle.
- Add stable test selectors for 3D object pick targets and per-door buttons so future Playwright coverage can avoid coordinate-based clicks entirely.
- Consider adding direct drag for object movement if a richer editing UX is needed beyond inspector nudges.

- 2026-03-08: Enabled 360-degree orbital rotation for the isometric room camera via OrbitControls while keeping the fixed isometric tilt.
- 2026-03-08: Replaced the previous planner shell with a RoomForge demo app: `Apartment / House` project types, template switching, 2D / isometric / 3D modes, A/B variants, live layout validation, and PNG/PDF/JSON export.
- 2026-03-08: Added normalized planner data in `src/data/plannerData.js` and planner state utilities in `src/lib/planner.js`, including templates, style presets, lighting scenarios, categorized catalog data, variant tiers, and export helpers.
- 2026-03-08: Added `src/components/Planner2D.jsx` for grid-based editing and drag/drop placement plus `src/components/PlannerScene.jsx` for shared isometric/3D rendering with selected-item glow and single-wall fade near the camera.
- 2026-03-08: Added repository polish deliverables: `README.md`, `ROADMAP.md`, `CONTRIBUTING.md`, GitHub issue templates, `vercel.json`, and a README screenshot asset at `public/docs/roomforge-demo.png`.
- 2026-03-08: Verified `npm run build` passes after the RoomForge rewrite. Vite still reports the pre-existing `three-mesh-bvh` / `BatchedMesh` warning and a large bundle warning. Verified the default 2D demo view via Playwright; fresh artifact state shows `issues: 0` in `output/web-game/state-0.json`.
- 2026-03-08: Removed export capability for now from the app shell and docs, and removed the temporary `jspdf` dependency. Verified `npm run build` still passes after the removal.
- 2026-03-08: Replaced the old scale-only item variants with family-specific procedural variant profiles in `src/data/plannerData.js` and updated `src/components/PlannerScene.jsx` to render distinct silhouettes per tier (for example loveseat / track-arm / tuxedo / armless / curved sofas, single / platform / sleigh / low / canopy beds, and analogous families for chairs, tables, storage, mirrors, lights, bath fixtures, appliances, textiles, and decor).
- 2026-03-08: Added direct in-scene dragging for items in `isometric` and `3d` modes via a floor-plane drag interaction in `src/components/PlannerScene.jsx`; OrbitControls now pause while an item is being dragged so movement behaves more like a game editor than a camera tool.
- 2026-03-08: Collapsed view modes to two user-facing options only: `2D` and `Isometric`. Removed the separate `3D` mode branch from the UI/state/docs, with isometric remaining the only 3D-like presentation mode.
- 2026-03-08: Removed compare controls and compare-facing copy from the UI, docs, and layout styles. The app now presents a single active layout without A/B buttons or side-by-side comparison controls.
- 2026-03-08: Added procedural mini-previews for catalog cards and replacement cards via `src/components/ItemVariantPreview.jsx`, so each replacement now shows a silhouette matching the actual target variant instead of a generic swatch. Also switched the initial view mode from `2D` to `Isometric`.

Updated TODO / handoff:
- Add stable selectors and viewport-aware controls so Playwright can exercise the isometric and 3D modes without relying on coordinate guesses.
- Deepen the hybrid wall editing model beyond rectangular room resizing if manual non-rectilinear wall shaping becomes a hard requirement.
- Replace procedural/local placeholder asset keys with true local GLTF hero assets for more of the catalog if visual fidelity becomes the next priority.
