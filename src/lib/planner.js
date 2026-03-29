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

export function getSceneConfig(variant, themeMode = 'light') {
  const style = getStylePreset(variant.stylePresetId, themeMode);
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

function getItemBounds(item) {
  const footprint = getItemFootprint(item);
  return {
    left: item.x - footprint.width / 2,
    right: item.x + footprint.width / 2,
    top: item.z - footprint.depth / 2,
    bottom: item.z + footprint.depth / 2,
  };
}

function overlaps(a, b, gap = 0.08) {
  return a.left < b.right - gap && a.right > b.left + gap && a.top < b.bottom - gap && a.bottom > b.top + gap;
}

function roomRect(room) {
  return {
    left: room.x,
    right: room.x + room.width,
    top: room.z,
    bottom: room.z + room.depth,
  };
}

function roomOverlapsAny(nextRoom, siblingRooms, gap = 0.02) {
  const nextRect = roomRect(nextRoom);
  return siblingRooms.some((room) => {
    const siblingRect = roomRect(room);
    return (
      nextRect.left < siblingRect.right - gap &&
      nextRect.right > siblingRect.left + gap &&
      nextRect.top < siblingRect.bottom - gap &&
      nextRect.bottom > siblingRect.top + gap
    );
  });
}

export function evaluateItemPlacement(room, candidateItem, ignoreItemId = null) {
  const candidateBounds = getItemBounds(candidateItem);
  const insideWalls =
    candidateBounds.left >= 0 &&
    candidateBounds.right <= room.width &&
    candidateBounds.top >= 0 &&
    candidateBounds.bottom <= room.depth;
  const hitItem = room.items.some((item) => {
    if (item.id === ignoreItemId) {
      return false;
    }
    return overlaps(candidateBounds, getItemBounds(item));
  });
  return {
    insideWalls,
    hitItem,
    valid: insideWalls && !hitItem,
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
        const candidateRoom = normalizeRoom({
          ...room,
          x: snap(Math.max(0, nextRect.x)),
          z: snap(Math.max(0, nextRect.z)),
          width: snap(Math.max(2, nextRect.width)),
          depth: snap(Math.max(2, nextRect.depth)),
        });
        const siblings = floor.rooms.filter((entry) => entry.id !== room.id);
        if (roomOverlapsAny(candidateRoom, siblings)) {
          return room;
        }
        return candidateRoom;
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
        const target = room.items.find((item) => item.id === itemId);
        if (!target || target.locked) {
          return room;
        }
        const candidate = {
          ...target,
          x: snap(x),
          z: snap(z),
        };
        const placement = evaluateItemPlacement(room, candidate, itemId);
        if (!placement.valid) {
          return room;
        }
        return {
          ...room,
          items: room.items.map((item) => (item.id === itemId ? candidate : item)),
        };
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

        const item = ensureItemInRoom(room, {
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
        });

        const directPlacement = evaluateItemPlacement(room, item);
        if (directPlacement.valid) {
          return {
            ...room,
            items: [...room.items, item],
          };
        }

        for (let scanZ = 0.8; scanZ <= room.depth - 0.8; scanZ += 0.4) {
          for (let scanX = 0.8; scanX <= room.width - 0.8; scanX += 0.4) {
            const scannedCandidate = ensureItemInRoom(room, { ...item, x: scanX, z: scanZ });
            if (evaluateItemPlacement(room, scannedCandidate).valid) {
              return {
                ...room,
                items: [...room.items, scannedCandidate],
              };
            }
          }
        }

        return room;
      }),
    })),
  }));
}

export function renameRoom(state, roomId, label) {
  const nextLabel = `${label ?? ''}`.trim();
  if (!nextLabel) {
    return state;
  }
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => (room.id === roomId ? { ...room, label: nextLabel } : room)),
    })),
  }));
}

export function addRoomFromWall(state, roomId, wall) {
  return updateVariant(state, (variant) => ({
    ...variant,
    floors: variant.floors.map((floor) => ({
      ...floor,
      rooms: (() => {
        const sourceRoom = floor.rooms.find((room) => room.id === roomId);
        if (!sourceRoom) {
          return floor.rooms;
        }
        const newRoom = {
          ...deepClone(sourceRoom),
          id: `room-${Date.now()}`,
          label: `${sourceRoom.label} +`,
          items: [],
          openings: { doors: [], windows: [] },
        };
        if (wall === 'east') newRoom.x = snap(sourceRoom.x + sourceRoom.width);
        if (wall === 'west') newRoom.x = snap(sourceRoom.x - sourceRoom.width);
        if (wall === 'south') newRoom.z = snap(sourceRoom.z + sourceRoom.depth);
        if (wall === 'north') newRoom.z = snap(sourceRoom.z - sourceRoom.depth);
        newRoom.x = Math.max(0, newRoom.x);
        newRoom.z = Math.max(0, newRoom.z);

        if (roomOverlapsAny(newRoom, floor.rooms)) {
          return floor.rooms;
        }
        return [...floor.rooms, newRoom];
      })(),
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
