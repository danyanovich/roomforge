import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CATALOG_BY_ID, getRoomArea } from '../data/plannerData';
import { getItemFootprint } from '../lib/planner';

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
    activeRoomId,
    readOnly = false,
  },
  ref
) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [dropPreview, setDropPreview] = useState(null);
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
      onMoveItem(dragState.roomId, dragState.itemId, point.x - dragState.offsetX, point.z - dragState.offsetZ);
      return;
    }

    const room = floor.rooms.find((entry) => entry.id === dragState.roomId);
    if (!room) {
      return;
    }

    if (dragState.kind === 'room-move') {
      onResizeRoom(room.id, {
        x: Math.max(0, Math.round(point.x - dragState.offsetX)),
        z: Math.max(0, Math.round(point.z - dragState.offsetZ)),
        width: room.width,
        depth: room.depth,
      });
    }

    if (dragState.kind === 'room-resize') {
      onResizeRoom(room.id, {
        x: room.x,
        z: room.z,
        width: Math.max(2, Math.round(point.x - room.x)),
        depth: Math.max(2, Math.round(point.z - room.z)),
      });
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
    setDropPreview({ ...JSON.parse(catalogPayload), x: point.x, z: point.z });
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
    onAddItem(room.id, JSON.parse(payload).catalogId, JSON.parse(payload).tier, point.x - room.x, point.z - room.z);
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
        onPointerUp={() => setDragState(null)}
        onPointerLeave={() => setDragState(null)}
      >
        <rect width={bounds.width} height={bounds.height} className="planner-bg" />
        {drawGrid(bounds.width, bounds.height)}

        {floor.rooms.map((room) => {
          const selected = selection?.kind === 'room' && selection.roomId === room.id;
          const roomX = toCanvasX(room.x);
          const roomZ = toCanvasZ(room.z);
          const roomWidth = room.width * CELL_SIZE;
          const roomDepth = room.depth * CELL_SIZE;

          return (
            <g key={room.id} className={room.id === activeRoomId ? 'active-room' : ''}>
              <rect
                x={roomX}
                y={roomZ}
                width={roomWidth}
                height={roomDepth}
                className={`room-rect ${selected ? 'selected' : ''}`}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSelectRoom(room.id);
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
                      setDragState({ kind: 'room-move', roomId: room.id, offsetX: point.x - room.x, offsetZ: point.z - room.z });
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
              <text x={roomX + roomWidth / 2} y={roomZ + 26} className="room-label-2d">
                {room.label}
              </text>
              <text x={roomX + roomWidth / 2} y={roomZ + 48} className="room-area-2d">
                {getRoomArea(room)} m²
              </text>

              {room.items.map((item) => {
                const rect = itemRect(item);
                const selectedItem = selection?.kind === 'item' && selection.itemId === item.id;
                const itemX = toCanvasX(room.x + item.x) - rect.width / 2;
                const itemZ = toCanvasZ(room.z + item.z) - rect.depth / 2;

                return (
                  <g
                    key={item.id}
                    transform={`rotate(${(item.rotation * 180) / Math.PI}, ${itemX + rect.width / 2}, ${itemZ + rect.depth / 2})`}
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
                        offsetX: point.x - room.x - item.x,
                        offsetZ: point.z - room.z - item.z,
                      });
                    }}
                  >
                    <rect
                      x={itemX}
                      y={itemZ}
                      width={rect.width}
                      height={rect.depth}
                      rx={12}
                      className={`item-rect ${selectedItem ? 'selected' : ''}`}
                      fill={item.color}
                    />
                    <text x={itemX + rect.width / 2} y={itemZ + rect.depth / 2 + 4} className="item-label-2d">
                      {CATALOG_BY_ID[item.catalogId]?.label ?? item.label}
                    </text>
                    {selectedItem && <rect x={itemX - 4} y={itemZ - 4} width={rect.width + 8} height={rect.depth + 8} rx={16} className="item-outline-2d" />}
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
            className="drop-preview"
          />
        )}
      </svg>
    </div>
  );
});

export default Planner2D;
