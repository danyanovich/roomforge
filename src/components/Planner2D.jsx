import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CATALOG_BY_ID, getRoomArea } from '../data/plannerData';
import { evaluateItemPlacement, getItemFootprint } from '../lib/planner';

const CELL_SIZE = 56;
const PADDING = 56;

function getBounds(floor) {
  const rooms = floor.rooms;
  const maxX = Math.max(...rooms.map((room) => room.x + room.width), 10);
  const maxZ = Math.max(...rooms.map((room) => room.z + room.depth), 10);
  return {
    width: maxX * CELL_SIZE + PADDING * 2,
    height: maxZ * CELL_SIZE + PADDING * 2,
  };
}

function toCanvasX(gridX) {
  return PADDING + gridX * CELL_SIZE;
}

function toCanvasZ(gridZ) {
  return PADDING + gridZ * CELL_SIZE;
}

function fromPointer(event, bounds) {
  const rect = bounds.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - PADDING) / CELL_SIZE,
    z: (event.clientY - rect.top - PADDING) / CELL_SIZE,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawGrid(width, height) {
  const lines = [];
  for (let x = PADDING; x <= width - PADDING; x += CELL_SIZE) {
    lines.push(<line key={`vx-${x}`} x1={x} y1={PADDING} x2={x} y2={height - PADDING} className="grid-line" />);
  }
  for (let y = PADDING; y <= height - PADDING; y += CELL_SIZE) {
    lines.push(<line key={`hz-${y}`} x1={PADDING} y1={y} x2={width - PADDING} y2={y} className="grid-line" />);
  }
  return lines;
}

function itemRect(item) {
  const footprint = getItemFootprint(item);
  return {
    width: footprint.width * CELL_SIZE,
    depth: footprint.depth * CELL_SIZE,
  };
}

function roomCollisionState(floor, roomId, candidateRect) {
  const candidate = {
    left: candidateRect.x,
    right: candidateRect.x + candidateRect.width,
    top: candidateRect.z,
    bottom: candidateRect.z + candidateRect.depth,
  };
  const overlap = floor.rooms.some((room) => {
    if (room.id === roomId) {
      return false;
    }
    const other = {
      left: room.x,
      right: room.x + room.width,
      top: room.z,
      bottom: room.z + room.depth,
    };
    return candidate.left < other.right - 0.02 && candidate.right > other.left + 0.02 && candidate.top < other.bottom - 0.02 && candidate.bottom > other.top + 0.02;
  });
  return {
    overlap,
    valid: !overlap && candidateRect.x >= 0 && candidateRect.z >= 0 && candidateRect.width >= 2 && candidateRect.depth >= 2,
  };
}

const Planner2D = forwardRef(function Planner2D(
  {
    floor,
    palette,
    selection,
    onSelectRoom,
    onSelectItem,
    onMoveItem,
    onResizeRoom,
    onAddItem,
    onAddRoomFromWall,
    activeRoomId,
    pendingPlacement,
    onCommitPlacement,
    showRoomMeta = true,
    readOnly = false,
  },
  ref
) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [dropPreview, setDropPreview] = useState(null);
  const [itemPlacementPreview, setItemPlacementPreview] = useState(null);
  const [roomPlacementPreview, setRoomPlacementPreview] = useState(null);
  const bounds = useMemo(() => getBounds(floor), [floor]);

  useImperativeHandle(ref, () => ({
    async exportPng() {
      const svg = svgRef.current;
      if (!svg) {
        return null;
      }

      const serializer = new XMLSerializer();
      const svgMarkup = serializer.serializeToString(svg);
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      const canvas = document.createElement('canvas');
      canvas.width = bounds.width;
      canvas.height = bounds.height;
      const context = canvas.getContext('2d');

      return new Promise((resolve) => {
        image.onload = () => {
          context.fillStyle = palette.background;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        image.src = url;
      });
    },
  }));

  const handlePointerMove = (event) => {
    if (!dragState || readOnly) {
      return;
    }

    const point = fromPointer(event, svgRef.current);
    if (dragState.kind === 'item') {
      const room = floor.rooms.find((entry) => entry.id === dragState.roomId);
      if (!room) {
        return;
      }
      const sourceItem = room.items.find((item) => item.id === dragState.itemId);
      if (!sourceItem) {
        return;
      }
      const candidate = {
        ...sourceItem,
        x: point.x - dragState.offsetX,
        z: point.z - dragState.offsetZ,
      };
      const placement = evaluateItemPlacement(room, candidate, sourceItem.id);
      setItemPlacementPreview({
        roomId: room.id,
        itemId: sourceItem.id,
        x: candidate.x,
        z: candidate.z,
        valid: placement.valid,
      });
      return;
    }

    const room = floor.rooms.find((entry) => entry.id === dragState.roomId);
    if (!room) {
      return;
    }

    if (dragState.kind === 'room-move') {
      const candidateRect = {
        x: Math.max(0, Math.round(point.x - dragState.offsetX)),
        z: Math.max(0, Math.round(point.z - dragState.offsetZ)),
        width: room.width,
        depth: room.depth,
      };
      const placement = roomCollisionState(floor, room.id, candidateRect);
      setRoomPlacementPreview({ roomId: room.id, ...candidateRect, valid: placement.valid });
    }

    if (dragState.kind === 'room-resize') {
      const candidateRect = {
        x: room.x,
        z: room.z,
        width: Math.max(2, Math.round(point.x - room.x)),
        depth: Math.max(2, Math.round(point.z - room.z)),
      };
      const placement = roomCollisionState(floor, room.id, candidateRect);
      setRoomPlacementPreview({ roomId: room.id, ...candidateRect, valid: placement.valid });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (readOnly) {
      return;
    }
    const catalogPayload = event.dataTransfer.getData('application/x-roomforge-catalog');
    if (!catalogPayload) {
      return;
    }
    const point = fromPointer(event, wrapperRef.current);
    const payload = JSON.parse(catalogPayload);
    const room = floor.rooms.find((entry) => entry.id === activeRoomId) ?? floor.rooms[0];
    const catalogEntry = CATALOG_BY_ID[payload.catalogId];
    const candidate = {
      id: 'preview',
      catalogId: payload.catalogId,
      variantId: catalogEntry.variants.find((variant) => variant.tier === payload.tier)?.id ?? catalogEntry.variants[0].id,
      rotation: 0,
      x: point.x - room.x,
      z: point.z - room.z,
    };
    const placement = evaluateItemPlacement(room, candidate);
    setDropPreview({ ...payload, x: point.x, z: point.z, valid: placement.valid });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (readOnly) {
      return;
    }
    const payload = event.dataTransfer.getData('application/x-roomforge-catalog');
    if (!payload) {
      return;
    }
    const room = floor.rooms.find((entry) => entry.id === activeRoomId) ?? floor.rooms[0];
    const point = fromPointer(event, wrapperRef.current);
    const parsedPayload = JSON.parse(payload);
    const catalogEntry = CATALOG_BY_ID[parsedPayload.catalogId];
    const candidate = {
      id: 'drop',
      catalogId: parsedPayload.catalogId,
      variantId: catalogEntry.variants.find((variant) => variant.tier === parsedPayload.tier)?.id ?? catalogEntry.variants[0].id,
      rotation: 0,
      x: point.x - room.x,
      z: point.z - room.z,
    };
    const placement = evaluateItemPlacement(room, candidate);
    if (!placement.valid) {
      setDropPreview({ ...parsedPayload, x: point.x, z: point.z, valid: false });
      return;
    }
    onAddItem(room.id, parsedPayload.catalogId, parsedPayload.tier, point.x - room.x, point.z - room.z);
    setDropPreview(null);
  };

  return (
    <div
      ref={wrapperRef}
      className="planner-2d"
      onDragOver={handleDragOver}
      onDragLeave={() => setDropPreview(null)}
      onDrop={handleDrop}
    >
      <svg
        ref={svgRef}
        width={bounds.width}
        height={bounds.height}
        viewBox={`0 0 ${bounds.width} ${bounds.height}`}
        onPointerMove={handlePointerMove}
        onPointerUp={() => {
          if (dragState?.kind === 'item' && itemPlacementPreview?.valid) {
            onMoveItem(itemPlacementPreview.roomId, itemPlacementPreview.itemId, itemPlacementPreview.x, itemPlacementPreview.z);
          }
          if ((dragState?.kind === 'room-move' || dragState?.kind === 'room-resize') && roomPlacementPreview?.valid) {
            onResizeRoom(roomPlacementPreview.roomId, roomPlacementPreview);
          }
          setDragState(null);
          setItemPlacementPreview(null);
          setRoomPlacementPreview(null);
        }}
        onPointerLeave={() => {
          setDragState(null);
          setItemPlacementPreview(null);
          setRoomPlacementPreview(null);
        }}
      >
        <rect width={bounds.width} height={bounds.height} className="planner-bg" />
        {drawGrid(bounds.width, bounds.height)}

        {floor.rooms.map((room) => {
          const selected = selection?.kind === 'room' && selection.roomId === room.id;
          const previewRoom = roomPlacementPreview?.roomId === room.id ? roomPlacementPreview : null;
          const renderRoom = previewRoom ? { ...room, ...previewRoom } : room;
          const roomX = toCanvasX(renderRoom.x);
          const roomZ = toCanvasZ(renderRoom.z);
          const roomWidth = renderRoom.width * CELL_SIZE;
          const roomDepth = renderRoom.depth * CELL_SIZE;

          return (
            <g key={room.id} className={room.id === activeRoomId ? 'active-room' : ''}>
              <rect
                x={roomX}
                y={roomZ}
                width={roomWidth}
                height={roomDepth}
                className={`room-rect ${selected ? 'selected' : ''} ${previewRoom ? (previewRoom.valid ? 'room-valid' : 'room-invalid') : ''}`}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSelectRoom(room.id);
                  if (readOnly || !pendingPlacement) {
                    return;
                  }
                  const catalogEntry = CATALOG_BY_ID[pendingPlacement.catalogId];
                  const point = fromPointer(event, svgRef.current);
                  const localX = clamp(point.x - renderRoom.x, 0.8, renderRoom.width - 0.8);
                  const localZ = clamp(point.z - renderRoom.z, 0.8, renderRoom.depth - 0.8);
                  const candidate = {
                    id: 'tap-placement',
                    catalogId: pendingPlacement.catalogId,
                    variantId: catalogEntry.variants.find((variant) => variant.tier === pendingPlacement.tier)?.id ?? catalogEntry.variants[0].id,
                    rotation: 0,
                    x: localX,
                    z: localZ,
                  };
                  if (!evaluateItemPlacement(renderRoom, candidate).valid) {
                    return;
                  }
                  onAddItem(room.id, pendingPlacement.catalogId, pendingPlacement.tier, localX, localZ);
                  onCommitPlacement?.();
                }}
              />
              {!readOnly && (
                <>
                  <rect
                    x={roomX + 8}
                    y={roomZ + 8}
                    width={14}
                    height={14}
                    className="room-handle move"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      const point = fromPointer(event, svgRef.current);
                      setDragState({ kind: 'room-move', roomId: room.id, offsetX: point.x - renderRoom.x, offsetZ: point.z - renderRoom.z });
                    }}
                  />
                  <rect
                    x={roomX + roomWidth - 16}
                    y={roomZ + roomDepth - 16}
                    width={14}
                    height={14}
                    className="room-handle resize"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      setDragState({ kind: 'room-resize', roomId: room.id });
                    }}
                  />
                </>
              )}
              {showRoomMeta && (
                <>
                  <text x={roomX + roomWidth / 2} y={roomZ + 26} className="room-label-2d">
                    {room.label}
                  </text>
                  <text x={roomX + roomWidth / 2} y={roomZ + 48} className="room-area-2d">
                    {getRoomArea(room)} m²
                  </text>
                </>
              )}

              {!readOnly && selection?.roomId === room.id && (
                <>
                  {[
                    { wall: 'north', x: roomX + roomWidth / 2, y: roomZ - 12 },
                    { wall: 'south', x: roomX + roomWidth / 2, y: roomZ + roomDepth + 12 },
                    { wall: 'east', x: roomX + roomWidth + 12, y: roomZ + roomDepth / 2 },
                    { wall: 'west', x: roomX - 12, y: roomZ + roomDepth / 2 },
                  ].map((wallAction) => (
                    <g
                      key={`${room.id}-${wallAction.wall}`}
                      className="wall-add-control"
                      transform={`translate(${wallAction.x}, ${wallAction.y})`}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        onAddRoomFromWall?.(room.id, wallAction.wall);
                      }}
                    >
                      <circle r="12" className="wall-add-circle" />
                      <text y="4" textAnchor="middle" className="wall-add-plus">
                        +
                      </text>
                    </g>
                  ))}
                </>
              )}

              {room.items.map((item) => {
                const rect = itemRect(item);
                const selectedItem = selection?.kind === 'item' && selection.itemId === item.id;
                const itemX = toCanvasX(renderRoom.x + item.x) - rect.width / 2;
                const itemZ = toCanvasZ(renderRoom.z + item.z) - rect.depth / 2;
                const isPreviewTarget = itemPlacementPreview?.itemId === item.id;
                const renderX = isPreviewTarget ? toCanvasX(room.x + itemPlacementPreview.x) - rect.width / 2 : itemX;
                const renderZ = isPreviewTarget ? toCanvasZ(room.z + itemPlacementPreview.z) - rect.depth / 2 : itemZ;

                return (
                  <g
                    key={item.id}
                    transform={`rotate(${(item.rotation * 180) / Math.PI}, ${renderX + rect.width / 2}, ${renderZ + rect.depth / 2})`}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      onSelectItem(room.id, item.id);
                      if (readOnly || item.locked) {
                        return;
                      }
                      const point = fromPointer(event, svgRef.current);
                      setDragState({
                        kind: 'item',
                        roomId: room.id,
                        itemId: item.id,
                        offsetX: point.x - renderRoom.x - item.x,
                        offsetZ: point.z - renderRoom.z - item.z,
                      });
                    }}
                  >
                    <rect
                      x={renderX}
                      y={renderZ}
                      width={rect.width}
                      height={rect.depth}
                      rx={12}
                      className={`item-rect ${selectedItem ? 'selected' : ''} ${isPreviewTarget ? (itemPlacementPreview.valid ? 'placement-valid' : 'placement-invalid') : ''}`}
                      fill={item.color}
                    />
                    <text x={renderX + rect.width / 2} y={renderZ + rect.depth / 2 + 4} className="item-label-2d">
                      {CATALOG_BY_ID[item.catalogId]?.label ?? item.label}
                    </text>
                    {selectedItem && <rect x={renderX - 4} y={renderZ - 4} width={rect.width + 8} height={rect.depth + 8} rx={16} className="item-outline-2d" />}
                  </g>
                );
              })}
            </g>
          );
        })}

        {dropPreview && (
          <rect
            x={toCanvasX(dropPreview.x) - 24}
            y={toCanvasZ(dropPreview.z) - 24}
            width={48}
            height={48}
            rx={14}
            className={`drop-preview ${dropPreview.valid ? 'valid' : 'invalid'}`}
          />
        )}
      </svg>
    </div>
  );
});

export default Planner2D;
