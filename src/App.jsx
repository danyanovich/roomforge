import React, { useEffect, useMemo, useState } from 'react';
import ItemVariantPreview from './components/ItemVariantPreview';
import Planner2D from './components/Planner2D';
import PlannerScene from './components/PlannerScene';
import {
  CATALOG_BY_ID,
  CATALOG_CATEGORIES,
  CATALOG_ITEMS,
  COLOR_SWATCHES,
  LIGHTING_SCENARIOS,
  PROPERTY_TYPES,
  STYLE_PRESETS,
  TEMPLATES,
} from './data/plannerData';
import {
  addItemToRoom,
  createInitialState,
  deleteSelectedItem,
  duplicateSelectedItem,
  getFloor,
  getItem,
  getProjectSummary,
  getRoom,
  getSceneConfig,
  getSelectionStats,
  getVariant,
  moveItem,
  recolorSelectedItem,
  replaceSelectedItem,
  resizeRoom,
  rotateSelectedItem,
  runLayoutValidation,
  setActiveFloor,
  setTemplate,
  setVariantLighting,
  setVariantStyle,
  toggleLockSelectedItem,
} from './lib/planner';

const THEME_STORAGE_KEY = 'roomforge.theme';

const UI_THEME_TOKENS = {
  light: {
    bodyBackground:
      'radial-gradient(circle at top left, rgba(255, 255, 255, 0.92), transparent 24%), linear-gradient(135deg, #f4ede4, #ddccb9 48%, #cdb5a4 100%)',
    text: '#221d1a',
    muted: 'rgba(34, 29, 26, 0.78)',
    subtle: 'rgba(34, 29, 26, 0.62)',
    panelBorder: 'rgba(82, 67, 57, 0.14)',
    panelOverlay: 'linear-gradient(180deg, rgba(255, 251, 245, 0.94), rgba(246, 237, 227, 0.88))',
    panelShadow: 'rgba(48, 36, 29, 0.14)',
    frameBackground: 'linear-gradient(180deg, rgba(255, 252, 248, 0.94), rgba(236, 223, 209, 0.98))',
    controlBackground: 'rgba(255, 250, 244, 0.86)',
    controlHover: 'rgba(255, 255, 255, 0.98)',
    controlActive: 'rgba(255, 255, 255, 0.98)',
    controlActiveBorder: 'rgba(43, 36, 33, 0.18)',
    cardBackground: 'rgba(255, 252, 247, 0.82)',
    insetBackground: 'rgba(255, 250, 244, 0.7)',
    successBackground: 'rgba(188, 220, 193, 0.62)',
    dangerBackground: 'rgba(176, 95, 84, 0.16)',
    dangerText: '#8d463a',
    swatchRing: 'rgba(60, 48, 40, 0.22)',
    sceneOverlayBg: 'rgba(255, 251, 245, 0.96)',
    sceneOverlayBgActive: 'rgba(255, 246, 232, 0.98)',
    sceneOverlayBorder: 'rgba(60, 48, 40, 0.14)',
    sceneOverlayText: '#241f1b',
    sceneOverlayMuted: 'rgba(36, 31, 27, 0.72)',
  },
  dark: {
    bodyBackground:
      'radial-gradient(circle at top left, rgba(113, 93, 72, 0.2), transparent 24%), linear-gradient(135deg, #0f1014, #151821 48%, #1b1515 100%)',
    text: '#f4ede6',
    muted: 'rgba(244, 237, 230, 0.82)',
    subtle: 'rgba(244, 237, 230, 0.66)',
    panelBorder: 'rgba(255, 255, 255, 0.1)',
    panelOverlay: 'linear-gradient(180deg, rgba(28, 31, 38, 0.94), rgba(22, 24, 31, 0.92))',
    panelShadow: 'rgba(0, 0, 0, 0.34)',
    frameBackground: 'linear-gradient(180deg, rgba(27, 29, 35, 0.94), rgba(16, 18, 24, 0.98))',
    controlBackground: 'rgba(255, 255, 255, 0.06)',
    controlHover: 'rgba(255, 255, 255, 0.1)',
    controlActive: 'rgba(255, 255, 255, 0.16)',
    controlActiveBorder: 'rgba(255, 255, 255, 0.2)',
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    insetBackground: 'rgba(255, 255, 255, 0.045)',
    successBackground: 'rgba(73, 125, 93, 0.42)',
    dangerBackground: 'rgba(194, 99, 88, 0.22)',
    dangerText: '#ffb1a5',
    swatchRing: 'rgba(255, 255, 255, 0.22)',
    sceneOverlayBg: 'rgba(17, 20, 25, 0.96)',
    sceneOverlayBgActive: 'rgba(36, 31, 25, 0.98)',
    sceneOverlayBorder: 'rgba(255, 255, 255, 0.12)',
    sceneOverlayText: '#f6f1ec',
    sceneOverlayMuted: 'rgba(246, 241, 236, 0.72)',
  },
};

function getInitialThemeMode() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function variantTemplates(propertyType) {
  return TEMPLATES.filter((template) => template.propertyType === propertyType);
}

function SegmentButton({ active, onClick, children }) {
  return (
    <button type="button" className={`segment-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

function LibraryCard({ item, accentColor, onAddQuick }) {
  const baseColor = accentColor ?? item.defaultColor;
  const previewVariant = item.variants.find((variant) => variant.tier === 'Standard') ?? item.variants[0];
  return (
    <div
      className="library-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('application/x-roomforge-catalog', JSON.stringify({ catalogId: item.id, tier: 'Standard' }));
      }}
    >
      <ItemVariantPreview variant={previewVariant} color={baseColor} className="library-card-preview" />
      <div className="library-card-body">
        <strong>{item.label}</strong>
        <small>{item.categoryLabel}</small>
        <button type="button" className="ghost-button" onClick={() => onAddQuick(item.id)}>
          Add to room
        </button>
      </div>
    </div>
  );
}

function ReplacementCard({ label, tier, color, variant, onClick, active }) {
  return (
    <button type="button" className={`replacement-card ${active ? 'active' : ''}`} onClick={onClick}>
      <ItemVariantPreview variant={variant} color={color} className="replacement-preview" />
      <strong>{label}</strong>
      <small>{tier}</small>
    </button>
  );
}

function ScenePane({
  title,
  mode,
  variant,
  floor,
  sceneConfig,
  selection,
  onSelectRoom,
  onSelectItem,
  onSelectWall,
  onMoveItem,
  onResizeRoom,
  onAddItem,
  activeRoomId,
  sceneRef,
  readOnly,
}) {
  return (
    <section className="scene-pane">
      <div className="scene-pane-header">
        <div>
          <p className="eyebrow">Current Variant</p>
          <h2>{title}</h2>
        </div>
        <small>{mode === '2d' ? 'Build on the grid' : 'Presentation view'}</small>
      </div>

      <div className="scene-frame">
        {mode === '2d' ? (
          <Planner2D
            ref={sceneRef}
            floor={floor}
            palette={sceneConfig.style.palette}
            selection={selection}
            onSelectRoom={onSelectRoom}
            onSelectItem={onSelectItem}
            onMoveItem={onMoveItem}
            onResizeRoom={onResizeRoom}
            onAddItem={onAddItem}
            activeRoomId={activeRoomId}
            readOnly={readOnly}
          />
        ) : (
          <PlannerScene
            ref={sceneRef}
            floor={floor}
            selection={selection}
            palette={sceneConfig.style.palette}
            lighting={sceneConfig.lighting}
            mode={mode}
            onSelectRoom={onSelectRoom}
            onSelectItem={onSelectItem}
            onSelectWall={onSelectWall}
            onMoveItem={onMoveItem}
            activeRoomId={activeRoomId}
            readOnly={readOnly}
          />
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [state, setState] = useState(() => createInitialState());
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [hasExplicitTheme, setHasExplicitTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'light' || savedTheme === 'dark';
  });

  const activeVariant = useMemo(() => getVariant(state.project, state.activeVariantId), [state.project, state.activeVariantId]);
  const activeFloor = useMemo(() => getFloor(activeVariant, activeVariant.activeFloorId), [activeVariant]);
  const activeRoom = useMemo(() => {
    if (state.selection?.roomId) {
      return getRoom(activeVariant, state.selection.roomId);
    }
    return activeFloor.rooms[0];
  }, [activeFloor, activeVariant, state.selection]);
  const activeItem = useMemo(() => (state.selection?.kind === 'item' ? getItem(activeRoom, state.selection.itemId) : null), [activeRoom, state.selection]);
  const activeCatalogItem = activeItem ? CATALOG_BY_ID[activeItem.catalogId] : null;
  const issues = useMemo(() => runLayoutValidation(activeVariant), [activeVariant]);
  const sceneConfig = useMemo(() => getSceneConfig(activeVariant, themeMode), [activeVariant, themeMode]);
  const selectionStats = useMemo(() => getSelectionStats(activeVariant, state.selection), [activeVariant, state.selection]);
  const projectSummary = useMemo(() => getProjectSummary(state.project, state.activeVariantId), [state.activeVariantId, state.project]);
  const uiTheme = UI_THEME_TOKENS[themeMode];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (hasExplicitTheme) {
      return undefined;
    }

    const applySystemTheme = (event) => setThemeMode(event.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', applySystemTheme);
    return () => mediaQuery.removeEventListener('change', applySystemTheme);
  }, [hasExplicitTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    document.body.style.background = uiTheme.bodyBackground;
    document.body.style.color = uiTheme.text;
    if (hasExplicitTheme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [hasExplicitTheme, themeMode, uiTheme]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        propertyType: state.project.propertyType,
        templateId: state.project.templateId,
        activeVariantId: state.activeVariantId,
        activeViewMode: state.activeViewMode,
        activeFloorId: activeVariant.activeFloorId,
        selectedRoomId: state.selection?.roomId ?? null,
        selectedItemId: state.selection?.itemId ?? null,
        counts: {
          floors: activeVariant.floors.length,
          rooms: activeVariant.floors.reduce((sum, floor) => sum + floor.rooms.length, 0),
          items: activeVariant.floors.reduce((sum, floor) => sum + floor.rooms.reduce((roomSum, room) => roomSum + room.items.length, 0), 0),
          issues: issues.length,
        },
      });
    window.advanceTime = (ms = 16) => new Promise((resolve) => window.setTimeout(resolve, ms));
    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [activeVariant, issues.length, state]);

  const availableTemplates = variantTemplates(state.project.propertyType);
  const filteredCatalog = CATALOG_ITEMS.filter((item) => item.categoryId === state.catalogCategoryId);
  const relatedItems = activeCatalogItem
    ? CATALOG_ITEMS.filter((item) => item.categoryId === activeCatalogItem.categoryId && item.id !== activeCatalogItem.id).slice(0, 5)
    : [];

  const updateState = (updater) => setState((current) => updater(current));

  const handleSelectRoom = (roomId) => setState((current) => ({ ...current, selection: { kind: 'room', roomId } }));
  const handleSelectItem = (roomId, itemId) => setState((current) => ({ ...current, selection: { kind: 'item', roomId, itemId } }));
  const handleSelectWall = (roomId, wall) => setState((current) => ({ ...current, selection: { kind: 'wall', roomId, wall } }));

  const addQuickItem = (catalogId) => {
    const targetRoomId = state.selection?.roomId ?? activeFloor.rooms[0].id;
    updateState((current) => addItemToRoom(current, targetRoomId, catalogId, 'Standard', 1.8, 1.8));
  };

  return (
    <div
      className="app-shell theme-shell"
      data-theme={themeMode}
      style={{
        '--panel': sceneConfig.style.palette.panel,
        '--panel-soft': sceneConfig.style.palette.panelSoft,
        '--accent': sceneConfig.style.palette.accent,
        '--line': sceneConfig.style.palette.line,
        '--background': sceneConfig.style.palette.background,
        '--body-background': uiTheme.bodyBackground,
        '--text-primary': uiTheme.text,
        '--text-muted': uiTheme.muted,
        '--text-subtle': uiTheme.subtle,
        '--panel-border': uiTheme.panelBorder,
        '--panel-overlay': uiTheme.panelOverlay,
        '--shadow': uiTheme.panelShadow,
        '--frame-background': uiTheme.frameBackground,
        '--control-background': uiTheme.controlBackground,
        '--control-hover': uiTheme.controlHover,
        '--control-active': uiTheme.controlActive,
        '--control-active-border': uiTheme.controlActiveBorder,
        '--card-background': uiTheme.cardBackground,
        '--inset-background': uiTheme.insetBackground,
        '--success-background': uiTheme.successBackground,
        '--danger-background': uiTheme.dangerBackground,
        '--danger-text': uiTheme.dangerText,
        '--swatch-ring': uiTheme.swatchRing,
        '--scene-overlay-bg': uiTheme.sceneOverlayBg,
        '--scene-overlay-bg-active': uiTheme.sceneOverlayBgActive,
        '--scene-overlay-border': uiTheme.sceneOverlayBorder,
        '--scene-overlay-text': uiTheme.sceneOverlayText,
        '--scene-overlay-muted': uiTheme.sceneOverlayMuted,
        '--scene-grid': sceneConfig.style.palette.grid,
        '--scene-room-fill': sceneConfig.style.palette.roomFill,
        '--scene-room-stroke': sceneConfig.style.palette.roomStroke,
        '--scene-highlight': sceneConfig.style.palette.highlight,
      }}
    >
      <aside className="left-rail">
        <div className="panel">
          <div className="panel-header">
            <span>Theme</span>
          </div>
          <div className="segment-group">
            {['light', 'dark'].map((mode) => (
              <SegmentButton
                key={mode}
                active={themeMode === mode}
                onClick={() => {
                  setThemeMode(mode);
                  setHasExplicitTheme(true);
                }}
              >
                {mode === 'light' ? 'Light' : 'Dark'}
              </SegmentButton>
            ))}
          </div>
        </div>

        <div className="panel hero-panel">
          <p className="eyebrow">RoomForge Demo</p>
          <h1>Plan, swap, refine.</h1>
          <p className="lede">
            Build on a 1:1 meter grid, switch between 2D and isometric, and refine one layout direction in place.
          </p>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>Project Type</span>
          </div>
          <div className="segment-group">
            {PROPERTY_TYPES.map((type) => (
              <SegmentButton
                key={type.id}
                active={state.project.propertyType === type.id}
                onClick={() =>
                  setState((current) =>
                    setTemplate(current, type.id === 'house' ? 'house-80' : 'one-bedroom', type.id)
                  )
                }
              >
                {type.label}
              </SegmentButton>
            ))}
          </div>

          <div className="panel-header compact">
            <span>Templates</span>
          </div>
          <div className="pill-grid">
            {availableTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`pill ${state.project.templateId === template.id ? 'active' : ''}`}
                onClick={() => setState((current) => setTemplate(current, template.id, state.project.propertyType))}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>View Mode</span>
          </div>
          <div className="segment-group">
            {['2d', 'isometric'].map((mode) => (
              <SegmentButton key={mode} active={state.activeViewMode === mode} onClick={() => setState((current) => ({ ...current, activeViewMode: mode }))}>
                {mode === '2d' ? '2D' : 'Isometric'}
              </SegmentButton>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>Floors</span>
          </div>
          <div className="pill-grid">
            {activeVariant.floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                className={`pill ${activeFloor.id === floor.id ? 'active' : ''}`}
                onClick={() => setState((current) => setActiveFloor(current, floor.id))}
              >
                {floor.label}
              </button>
            ))}
          </div>

          <div className="panel-header compact">
            <span>Styles</span>
          </div>
          <div className="pill-grid">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`pill ${activeVariant.stylePresetId === preset.id ? 'active' : ''}`}
                onClick={() => setState((current) => setVariantStyle(current, preset.id))}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="panel-header compact">
            <span>Lighting</span>
          </div>
          <div className="pill-grid">
            {LIGHTING_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`pill ${activeVariant.lightingScenarioId === scenario.id ? 'active' : ''}`}
                onClick={() => setState((current) => setVariantLighting(current, scenario.id))}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel catalog-panel">
          <div className="panel-header">
            <span>Furniture Library</span>
            <small>Drag into the 2D scene</small>
          </div>
          <div className="catalog-categories">
            {CATALOG_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`pill ${state.catalogCategoryId === category.id ? 'active' : ''}`}
                onClick={() => setState((current) => ({ ...current, catalogCategoryId: category.id }))}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="library-list">
            {filteredCatalog.map((item) => (
              <LibraryCard key={item.id} item={item} accentColor={activeItem?.color} onAddQuick={addQuickItem} />
            ))}
          </div>
        </div>
      </aside>

      <main className="main-stage">
        <ScenePane
          title="Current Layout"
          mode={state.activeViewMode}
          variant={activeVariant}
          floor={activeFloor}
          sceneConfig={sceneConfig}
          selection={state.selection}
          onSelectRoom={handleSelectRoom}
          onSelectItem={handleSelectItem}
          onSelectWall={handleSelectWall}
          onMoveItem={(roomId, itemId, x, z) => setState((current) => moveItem(current, roomId, itemId, x, z))}
          onResizeRoom={(roomId, nextRect) => setState((current) => resizeRoom(current, roomId, nextRect))}
          onAddItem={(roomId, catalogId, tier, x, z) => setState((current) => addItemToRoom(current, roomId, catalogId, tier, x, z))}
          activeRoomId={state.selection?.roomId ?? activeFloor.rooms[0].id}
          sceneRef={null}
          readOnly={false}
        />
      </main>

      <aside className="right-rail">
        <div className="panel">
          <div className="panel-header">
            <span>Selection</span>
            <small>{state.selection?.kind ?? 'none'}</small>
          </div>
          <h3>{activeItem ? activeCatalogItem.label : activeRoom?.label ?? 'Nothing selected'}</h3>
          <p className="muted-copy">
            {activeItem
              ? activeCatalogItem.description
              : activeRoom
                ? `${activeRoom.width}m × ${activeRoom.depth}m × ${activeRoom.height}m`
                : 'Select a room, wall, or object in the scene.'}
          </p>
          <div className="stats-grid">
            <div>
              <strong>{projectSummary.totalArea} m²</strong>
              <small>Total area</small>
            </div>
            <div>
              <strong>{projectSummary.items}</strong>
              <small>Total items</small>
            </div>
            <div>
              <strong>{issues.length}</strong>
              <small>Layout issues</small>
            </div>
            <div>
              <strong>{selectionStats.selectedCount}</strong>
              <small>Selected type count</small>
            </div>
          </div>
        </div>

        {activeItem && activeCatalogItem && (
          <>
            <div className="panel">
              <div className="panel-header">
                <span>Item Controls</span>
                <small>{activeItem.variantTier}</small>
              </div>
              <div className="button-row">
                <button type="button" className="ghost-button" onClick={() => setState((current) => rotateSelectedItem(current, current.selection))}>
                  Rotate
                </button>
                <button type="button" className="ghost-button" onClick={() => setState((current) => duplicateSelectedItem(current, current.selection))}>
                  Duplicate
                </button>
                <button type="button" className="ghost-button" onClick={() => setState((current) => toggleLockSelectedItem(current, current.selection))}>
                  {activeItem.locked ? 'Unlock' : 'Lock'}
                </button>
                <button type="button" className="ghost-button danger" onClick={() => setState((current) => deleteSelectedItem(current, current.selection))}>
                  Delete
                </button>
              </div>

              <div className="panel-header compact">
                <span>Color</span>
              </div>
              <div className="swatch-grid">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`swatch ${activeItem.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setState((current) => recolorSelectedItem(current, current.selection, color))}
                  />
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>Replace with Variants</span>
              </div>
              <div className="replacement-grid">
                {activeCatalogItem.variants.map((variant) => (
                  <ReplacementCard
                    key={variant.id}
                    label={variant.label}
                    tier={variant.tier}
                    color={activeItem.color}
                    variant={variant}
                    active={variant.id === activeItem.variantId}
                    onClick={() => setState((current) => replaceSelectedItem(current, current.selection, activeCatalogItem.id, variant.tier))}
                  />
                ))}
              </div>

              <div className="panel-header compact">
                <span>Related Replacements</span>
              </div>
              <div className="replacement-grid">
                {relatedItems.map((item) => (
                  <ReplacementCard
                    key={item.id}
                    label={item.label}
                    tier="Standard"
                    color={activeItem.color}
                    variant={item.variants.find((variant) => variant.tier === 'Standard') ?? item.variants[0]}
                    active={false}
                    onClick={() => setState((current) => replaceSelectedItem(current, current.selection, item.id, 'Standard'))}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="panel">
          <div className="panel-header">
            <span>Layout Validation</span>
            <small>Live rules</small>
          </div>
          <div className="issue-list">
            {issues.length ? (
              issues.map((issue) => (
                <div key={issue.id} className="issue-card">
                  <strong>{issue.label}</strong>
                  <small>{issue.roomId}</small>
                </div>
              ))
            ) : (
              <div className="issue-card success">
                <strong>No blocking issues detected</strong>
                <small>The current layout passes the built-in demo checks.</small>
              </div>
            )}
          </div>
        </div>

      </aside>
    </div>
  );
}
