import {
  CATALOG_BY_ID,
  COLOR_SWATCHES,
  VARIANT_TIERS,
  createProjectFromTemplate,
  getCatalogFamilies,
  getLightingScenario,
  getRoomArea,
  getStylePreset,
} from '../data/plannerData';

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getVariant(project, variantId) {
  return project.variants.find((variant) => variant.id === variantId) ?? project.variants[0];
}

export function getFloor(variant, floorId) {
  return variant.floors.find((floor) => floor.id === floorId) ?? variant.floors[0];
}

export function getAllRooms(variant) {
  return variant.floors.flatMap((floor) => floor.rooms);
}

export function getRoom(variant, roomId) {
  return getAllRooms(variant).find((room) => room.id === roomId) ?? getAllRooms(variant)[0];
}

export function getItem(room, itemId) {
  return room?.items.find((item) => item.id === itemId) ?? null;
}

export function getItemVariant(item) {
  const catalogItem = CATALOG_BY_ID[item.catalogId];
  return catalogItem?.variants.find((variant) => variant.id === item.variantId) ?? catalogItem?.variants[0] ?? null;
}

export function getItemFootprint(item) {
  const variant = getItemVariant(item);
  if (!variant) {
    return { width: 1, depth: 1, height: 1 };
  }

  const width = Math.abs(Math.cos(item.rotation)) > Math.abs(Math.sin(item.rotation)) ? variant.size[0] : variant.size[2];
  const depth = Math.abs(Math.cos(item.rotation)) > Math.abs(Math.sin(item.rotation)) ? variant.size[2] : variant.size[0];
  return { width, depth, height: variant.size[1] };
}

export function getSceneConfig(variant) {
  const style = getStylePreset(variant.stylePresetId);
  const lighting = getLightingScenario(variant.lightingScenarioId);
  return { style, lighting };
}

export function getSelectionStats(variant, selection) {
  const items = getAllRooms(variant).flatMap((room) => room.items);
  const byCatalogId = items.reduce((accumulator, item) => {
    accumulator[item.catalogId] = (accumulator[item.catalogId] ?? 0) + 1;
    return accumulator;
  }, {});
  const byCategory = items.reduce((accumulator, item) => {
    const categoryId = CATALOG_BY_ID[item.catalogId]?.categoryId ?? 'misc';
    accumulator[categoryId] = (accumulator[categoryId] ?? 0) + 1;
    return accumulator;
  }, {});

  if (!selection || selection.kind !== 'item') {
    return { totalItems: items.length, byCatalogId, byCategory, selectedCount: 0 };
  }

  const room = getRoom(variant, selection.roomId);
  const item = getItem(room, selection.itemId);
  return {
    totalItems: items.length,
    byCatalogId,
    byCategory,
    selectedCount: item ? byCatalogId[item.catalogId] ?? 0 : 0,
  };
}

export function createInitialState() {
  const project = createProjectFromTemplate('one-bedroom', 'apartment');
  return {
    project,
    activeVariantId: 'A',
    activeViewMode: 'isometric',
    selection: { kind: 'room', roomId: project.variants[0].floors[0].rooms[0].id },
    catalogCategoryId: 'living-room',
    cameraStateByMode: {
      '2d': null,
      isometric: null,
    },
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function snap(value) {
  return Math.round(value * 10) / 10;
}

function applyToVariant(project, variantId, updater) {
  return {
    ...project,
    variants: project.variants.map((variant) => (variant.id === variantId ? updater(variant) : variant)),
  };
}

function ensureItemInRoom(room, item) {
  const footprint = getItemFootprint(item);
  return {
    ...item,
    x: snap(clamp(item.x, footprint.width / 2, room.width - footprint.width / 2)),
    z: snap(clamp(item.z, footprint.depth / 2, room.depth - footprint.depth / 2)),
  };
}

function normalizeRoom(room) {
  return {
    ...room,
    items: room.items.map((item) => ensureItemInRoom(room, item)),
  };
}

export function setProjectType(state, propertyType, fallbackTemplateId) {
  const templateId = fallbackTemplateId ?? (propertyType === 'house' ? 'house-80' : 'one-bedroom');
  return {
    ...createInitialState(),
    project: createProjectFromTemplate(templateId, propertyType),
    selection: null,
  };
}

export function setTemplate(state, templateId, propertyType) {
  const project = createProjectFromTemplate(templateId, propertyType);
  return {
    ...state,
    project,
    activeVariantId: 'A',
    selection: { kind: 'room', roomId: project.variants[0].floors[0].rooms[0].id },
  };
}

export function updateVariant(state, updater) {
  return {
    ...state,
    project: applyToVariant(state.project, state.activeVariantId, updater),
  };
}

export function setVariantStyle(state, stylePresetId) {
  return updateVariant(state, (variant) => ({ ...variant, stylePresetId }));
}

export function setVariantLighting(state, lightingScenarioId) {
  return updateVariant(state, (variant) => ({ ...variant, lightingScenarioId }));
}

export function setActiveFloor(state, floorId) {
  return updateVariant(state, (variant) => ({ ...variant, activeFloorId: floorId }));
}

export function resizeRoom(state, roomId, nextRect) {
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== roomId) {
          return room;
        }
        return normalizeRoom({
          ...room,
          x: snap(Math.max(0, nextRect.x)),
          z: snap(Math.max(0, nextRect.z)),
          width: snap(Math.max(2, nextRect.width)),
          depth: snap(Math.max(2, nextRect.depth)),
        });
      }),
    })),
  }));
}

export function moveItem(state, roomId, itemId, x, z) {
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== roomId) {
          return room;
        }
        return normalizeRoom({
          ...room,
          items: room.items.map((item) =>
            item.id === itemId && !item.locked
              ? {
                  ...item,
                  x: snap(x),
                  z: snap(z),
                }
              : item
          ),
        });
      }),
    })),
  }));
}

export function addItemToRoom(state, roomId, catalogId, tier = 'Standard', x = 1.5, z = 1.5) {
  const catalogItem = CATALOG_BY_ID[catalogId];
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== roomId) {
          return room;
        }

        const item = {
          id: `${catalogId}-${Date.now()}`,
          catalogId,
          variantId: catalogItem.variants.find((variantEntry) => variantEntry.tier === tier)?.id ?? catalogItem.variants[1].id,
          variantTier: tier,
          family: catalogItem.family,
          label: `${tier} ${catalogItem.label}`,
          material: catalogItem.variants.find((variantEntry) => variantEntry.tier === tier)?.material ?? 'oak',
          color: catalogItem.defaultColor,
          x,
          z,
          rotation: 0,
          locked: false,
          animation: { kind: 'drop', startedAt: Date.now() },
        };

        return normalizeRoom({
          ...room,
          items: [...room.items, item],
        });
      }),
    })),
  }));
}

export function replaceSelectedItem(state, selection, nextCatalogId, nextTier) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }
  const catalogItem = CATALOG_BY_ID[nextCatalogId];
  if (!catalogItem) {
    return state;
  }

  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => ({
        ...room,
        items: room.items.map((item) =>
          item.id === selection.itemId
            ? {
                ...item,
                catalogId: nextCatalogId,
                variantId: catalogItem.variants.find((variantEntry) => variantEntry.tier === nextTier)?.id ?? catalogItem.variants[1].id,
                variantTier: nextTier,
                family: catalogItem.family,
                label: `${nextTier} ${catalogItem.label}`,
                material: catalogItem.variants.find((variantEntry) => variantEntry.tier === nextTier)?.material ?? item.material,
                color: item.color,
                animation: { kind: 'drop', startedAt: Date.now() },
              }
            : item
        ),
      })),
    })),
  }));
}

export function recolorSelectedItem(state, selection, color) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => ({
        ...room,
        items: room.items.map((item) => (item.id === selection.itemId ? { ...item, color } : item)),
      })),
    })),
  }));
}

export function rotateSelectedItem(state, selection) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => ({
        ...room,
        items: room.items.map((item) =>
          item.id === selection.itemId
            ? {
                ...item,
                rotation: snap(item.rotation + Math.PI / 2),
              }
            : item
        ),
      })),
    })),
  }));
}

export function toggleLockSelectedItem(state, selection) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => ({
        ...room,
        items: room.items.map((item) => (item.id === selection.itemId ? { ...item, locked: !item.locked } : item)),
      })),
    })),
  }));
}

export function deleteSelectedItem(state, selection) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }
  return {
    ...updateVariant(state, (variant) => ({
      ...variant,
      floors: variant.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) => ({
          ...room,
          items: room.items.filter((item) => item.id !== selection.itemId),
        })),
      })),
    })),
    selection: { kind: 'room', roomId: selection.roomId },
  };
}

export function duplicateSelectedItem(state, selection) {
  if (!selection || selection.kind !== 'item') {
    return state;
  }

  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== selection.roomId) {
          return room;
        }
        const source = room.items.find((item) => item.id === selection.itemId);
        if (!source) {
          return room;
        }
        return normalizeRoom({
          ...room,
          items: [
            ...room.items,
            {
              ...deepClone(source),
              id: `${source.catalogId}-${Date.now()}`,
              x: source.x + 0.5,
              z: source.z + 0.5,
              animation: { kind: 'drop', startedAt: Date.now() },
            },
          ],
        });
      }),
    })),
  }));
}

export function cloneVariant(state, sourceVariantId, targetVariantId) {
  const source = getVariant(state.project, sourceVariantId);
  return {
    ...state,
    project: {
      ...state.project,
      variants: state.project.variants.map((variant) =>
        variant.id === targetVariantId ? deepClone({ ...source, id: targetVariantId, label: variant.label }) : variant
      ),
    },
  };
}

function doorBlocked(room, item) {
  const footprint = getItemFootprint(item);
  const left = item.x - footprint.width / 2;
  const right = item.x + footprint.width / 2;
  const top = item.z - footprint.depth / 2;
  const bottom = item.z + footprint.depth / 2;
  const doors =
    room.openings?.doors?.length
      ? room.openings.doors
      : [{ wall: 'south', offset: Math.min(room.width - 0.8, 1), width: 1 }];

  return doors.some((door) => {
    if (door.wall === 'south') {
      return right > door.offset - door.width / 2 && left < door.offset + door.width / 2 && bottom > room.depth - 1.1;
    }
    if (door.wall === 'north') {
      return right > door.offset - door.width / 2 && left < door.offset + door.width / 2 && top < 1.1;
    }
    if (door.wall === 'east') {
      return bottom > door.offset - door.width / 2 && top < door.offset + door.width / 2 && right > room.width - 1.1;
    }
    return bottom > door.offset - door.width / 2 && top < door.offset + door.width / 2 && left < 1.1;
  });
}

function chairHitsWall(room, item) {
  if (item.family !== 'chair') {
    return false;
  }
  const footprint = getItemFootprint(item);
  return (
    item.x - footprint.width / 2 < 0.3 ||
    item.x + footprint.width / 2 > room.width - 0.3 ||
    item.z - footprint.depth / 2 < 0.3 ||
    item.z + footprint.depth / 2 > room.depth - 0.3
  );
}

function wardrobeBlocked(room, item) {
  if (!['wardrobe', 'cabinet'].includes(item.family)) {
    return false;
  }
  const footprint = getItemFootprint(item);
  const frontClearance = room.depth - (item.z + footprint.depth / 2);
  return frontClearance < 0.6;
}

function narrowPassage(room) {
  const usableWidth = room.width - room.items.reduce((max, item) => Math.max(max, getItemFootprint(item).width), 0);
  const usableDepth = room.depth - room.items.reduce((max, item) => Math.max(max, getItemFootprint(item).depth), 0);
  return usableWidth < 0.8 || usableDepth < 0.8;
}

function sofaTvTooClose(room) {
  const sofas = room.items.filter((item) => item.family === 'sofa');
  const tvs = room.items.filter((item) => item.family === 'tv');
  for (const sofa of sofas) {
    for (const tv of tvs) {
      const distance = Math.hypot(sofa.x - tv.x, sofa.z - tv.z);
      if (distance < 1.8) {
        return true;
      }
    }
  }
  return false;
}

export function runLayoutValidation(variant) {
  const issues = [];

  for (const room of getAllRooms(variant)) {
    if (narrowPassage(room)) {
      issues.push({ id: `${room.id}-narrow`, roomId: room.id, level: 'warning', label: 'Passage too narrow' });
    }

    if (sofaTvTooClose(room)) {
      issues.push({ id: `${room.id}-tv`, roomId: room.id, level: 'warning', label: 'Sofa is too close to the TV' });
    }

    for (const item of room.items) {
      if (doorBlocked(room, item)) {
        issues.push({ id: `${item.id}-door`, roomId: room.id, itemId: item.id, level: 'warning', label: 'Door swing is blocked' });
      }
      if (chairHitsWall(room, item)) {
        issues.push({ id: `${item.id}-chair`, roomId: room.id, itemId: item.id, level: 'warning', label: 'Chair hits the wall' });
      }
      if (wardrobeBlocked(room, item)) {
        issues.push({ id: `${item.id}-wardrobe`, roomId: room.id, itemId: item.id, level: 'warning', label: 'Wardrobe cannot open fully' });
      }
    }
  }

  return issues;
}

export function getProjectSummary(project, variantId) {
  const variant = getVariant(project, variantId);
  const rooms = getAllRooms(variant);
  const items = rooms.flatMap((room) => room.items);
  return {
    variant: variant.label,
    rooms: rooms.length,
    floors: variant.floors.length,
    totalArea: rooms.reduce((sum, room) => sum + getRoomArea(room), 0),
    items: items.length,
    families: getCatalogFamilies().reduce((accumulator, family) => {
      accumulator[family] = items.filter((item) => item.family === family).length;
      return accumulator;
    }, {}),
  };
}

export function createJsonExport(state) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      project: state.project,
      activeVariantId: state.activeVariantId,
      activeViewMode: state.activeViewMode,
      selection: state.selection,
      availableColors: COLOR_SWATCHES,
      availableVariantTiers: VARIANT_TIERS,
    },
    null,
    2
  );
}
