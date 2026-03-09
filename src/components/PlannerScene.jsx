import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, OrthographicCamera, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CATALOG_BY_ID } from '../data/plannerData';
import { getItemFootprint, getItemVariant } from '../lib/planner';

const WALL_THICKNESS = 0.08;

function SceneCamera({ mode, focus, controlsEnabled }) {
  const isIsometric = true;
  const Controls = OrbitControls;

  return (
    <>
      <OrthographicCamera makeDefault position={[focus[0] + 10, 10, focus[2] + 10]} zoom={42} near={0.1} far={100} />
      <Controls
        makeDefault
        target={focus}
        enabled={controlsEnabled}
        enablePan={false}
        enableZoom
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={22}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.6}
      />
    </>
  );
}

function useHiddenWall(room, active, mode) {
  const { camera } = useThree();
  const [hiddenWall, setHiddenWall] = useState(null);

  useFrame(() => {
    if (!active || mode === '2d') {
      if (hiddenWall !== null) {
        setHiddenWall(null);
      }
      return;
    }
    const center = new THREE.Vector3(room.x + room.width / 2, room.height / 2, room.z + room.depth / 2);
    const direction = camera.position.clone().sub(center);
    const nextWall = Math.abs(direction.x) > Math.abs(direction.z) ? (direction.x > 0 ? 'east' : 'west') : direction.z > 0 ? 'north' : 'south';
    if (nextWall !== hiddenWall) {
      setHiddenWall(nextWall);
    }
  });

  return hiddenWall;
}

function RoomWall({ room, wall, color, hiddenWall, onSelectWall, active }) {
  const span = wall === 'north' || wall === 'south' ? room.width : room.depth;
  const thickness = wall === 'north' || wall === 'south' ? [span, room.height, WALL_THICKNESS] : [WALL_THICKNESS, room.height, span];
  const opacity = hiddenWall === wall ? 0.08 : wall === 'south' || wall === 'west' ? 0.32 : 0.96;
  let position = [room.x + room.width / 2, room.height / 2, room.z];
  if (wall === 'north') {
    position = [room.x + room.width / 2, room.height / 2, room.z + room.depth];
  }
  if (wall === 'east') {
    position = [room.x + room.width, room.height / 2, room.z + room.depth / 2];
  }
  if (wall === 'west') {
    position = [room.x, room.height / 2, room.z + room.depth / 2];
  }

  return (
    <mesh
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelectWall?.(room.id, wall);
      }}
    >
      <boxGeometry args={thickness} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={active ? '#e6bd77' : '#000000'}
        emissiveIntensity={active ? 0.08 : 0}
      />
    </mesh>
  );
}

function ItemMesh({ item, room, palette, selected, dragging, onSelectItem, onStartDrag }) {
  const groupRef = useRef(null);
  const footprint = getItemFootprint(item);
  const variant = getItemVariant(item);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }
    const startedAt = item.animation?.startedAt;
    if (startedAt) {
      const elapsed = Math.min((Date.now() - startedAt) / 900, 1);
      const dropOffset = (1 - elapsed) * 1.4;
      const bounce = Math.sin(elapsed * Math.PI) * 0.12;
      groupRef.current.position.y = footprint.height / 2 + dropOffset + bounce;
    } else {
      groupRef.current.position.y = footprint.height / 2;
    }
    groupRef.current.scale.setScalar(dragging ? 1.08 : selected ? 1.05 + Math.sin(clock.elapsedTime * 4) * 0.01 : 1);
  });

  const color = item.color;
  const family = item.family;
  const geometryKey = variant?.geometryKey ?? family;
  const mainMaterialProps = { color, roughness: 0.84, emissive: selected ? palette.highlight : '#000000', emissiveIntensity: selected ? 0.28 : 0 };
  const accentMaterialProps = { color: '#6f5948', roughness: 0.82 };

  const material = <meshStandardMaterial {...mainMaterialProps} />;

  let geometry = (
    <RoundedBox args={[footprint.width, footprint.height, footprint.depth]} radius={0.08} smoothness={4}>
      {material}
    </RoundedBox>
  );

  if (geometryKey.startsWith('sofa-')) {
    const backDepth = geometryKey === 'sofa-curved' ? footprint.depth * 0.3 : footprint.depth * 0.22;
    const armWidth = geometryKey === 'sofa-minimal' ? 0.06 : geometryKey === 'sofa-tuxedo' ? footprint.width * 0.12 : footprint.width * 0.08;
    geometry = (
      <group>
        <RoundedBox
          args={[
            geometryKey === 'sofa-curved' ? footprint.width * 0.94 : footprint.width,
            geometryKey === 'sofa-minimal' ? footprint.height * 0.32 : footprint.height * 0.42,
            footprint.depth,
          ]}
          radius={geometryKey === 'sofa-curved' ? 0.24 : 0.08}
          smoothness={4}
          position={[0, -footprint.height * 0.12, 0]}
        >
          {material}
        </RoundedBox>
        <RoundedBox args={[footprint.width * (geometryKey === 'sofa-compact' ? 0.88 : 0.96), footprint.height * 0.3, backDepth]} radius={0.06} smoothness={4} position={[0, footprint.height * 0.14, -footprint.depth * 0.36]}>
          {material}
        </RoundedBox>
        {geometryKey !== 'sofa-minimal' && (
          <>
            <RoundedBox args={[armWidth, footprint.height * (geometryKey === 'sofa-tuxedo' ? 0.5 : 0.38), footprint.depth * 0.92]} radius={0.05} smoothness={4} position={[-footprint.width * 0.44, footprint.height * 0.02, 0]}>
              {material}
            </RoundedBox>
            <RoundedBox args={[armWidth, footprint.height * (geometryKey === 'sofa-tuxedo' ? 0.5 : 0.38), footprint.depth * 0.92]} radius={0.05} smoothness={4} position={[footprint.width * 0.44, footprint.height * 0.02, 0]}>
              {material}
            </RoundedBox>
          </>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('chair-')) {
    geometry = (
      <group>
        <RoundedBox args={[footprint.width * (geometryKey === 'chair-barrel' ? 0.92 : 1), footprint.height * 0.2, footprint.depth]} radius={geometryKey === 'chair-barrel' ? 0.18 : 0.05} smoothness={4} position={[0, -footprint.height * 0.16, 0]}>
          {material}
        </RoundedBox>
        {geometryKey !== 'chair-slipper' && (
          <RoundedBox
            args={[footprint.width * (geometryKey === 'chair-wingback' ? 0.9 : 1), footprint.height * (geometryKey === 'chair-wingback' ? 0.46 : 0.3), footprint.depth * (geometryKey === 'chair-barrel' ? 0.7 : 0.14)]}
            radius={geometryKey === 'chair-barrel' ? 0.16 : 0.04}
            smoothness={4}
            position={[0, footprint.height * 0.12, geometryKey === 'chair-barrel' ? 0 : -footprint.depth * 0.36]}
          >
            {material}
          </RoundedBox>
        )}
        {geometryKey === 'chair-wishbone' && (
          <>
            <mesh position={[-footprint.width * 0.24, -footprint.height * 0.02, -footprint.depth * 0.24]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.025, 0.025, footprint.height * 0.72, 10]} />
              <meshStandardMaterial {...accentMaterialProps} />
            </mesh>
            <mesh position={[footprint.width * 0.24, -footprint.height * 0.02, -footprint.depth * 0.24]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.025, 0.025, footprint.height * 0.72, 10]} />
              <meshStandardMaterial {...accentMaterialProps} />
            </mesh>
          </>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('lamp-') || geometryKey.startsWith('ceiling-')) {
    geometry = (
      <group>
        {!geometryKey.startsWith('ceiling-') && (
          <mesh position={[0, -footprint.height * 0.1, 0]} rotation={[0, 0, geometryKey === 'lamp-arc' ? -0.35 : 0]}>
            <cylinderGeometry args={[0.04, 0.05, footprint.height * 0.72, 12]} />
            <meshStandardMaterial {...accentMaterialProps} />
          </mesh>
        )}
        {geometryKey === 'lamp-tripod' && (
          <>
            {[-0.2, 0, 0.2].map((offset) => (
              <mesh key={offset} position={[offset, -footprint.height * 0.16, 0]} rotation={[0, 0, offset]}>
                <cylinderGeometry args={[0.025, 0.025, footprint.height * 0.7, 8]} />
                <meshStandardMaterial {...accentMaterialProps} />
              </mesh>
            ))}
          </>
        )}
        <mesh position={[0, geometryKey.startsWith('ceiling-') ? 0 : footprint.height * 0.22, 0]}>
          {geometryKey === 'lamp-globe' || geometryKey === 'ceiling-sputnik' ? (
            <sphereGeometry args={[Math.max(0.18, footprint.width * 0.28), 18, 18]} />
          ) : geometryKey === 'ceiling-disc' ? (
            <cylinderGeometry args={[footprint.width * 0.42, footprint.width * 0.48, footprint.height * 0.18, 24]} />
          ) : (
            <cylinderGeometry args={[footprint.width * 0.24, footprint.width * 0.32, footprint.height * 0.36, 18]} />
          )}
          {material}
        </mesh>
        {geometryKey === 'ceiling-sputnik' && (
          <>
            {Array.from({ length: 6 }).map((_, index) => {
              const angle = (index / 6) * Math.PI * 2;
              return (
                <group key={angle} rotation={[0, angle, 0]}>
                  <mesh position={[footprint.width * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.015, 0.015, footprint.width * 0.5, 6]} />
                    <meshStandardMaterial {...accentMaterialProps} />
                  </mesh>
                </group>
              );
            })}
          </>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('plant-')) {
    geometry = (
      <group>
        <mesh position={[0, -footprint.height * 0.18, 0]}>
          <cylinderGeometry args={[footprint.width * 0.22, footprint.width * 0.32, footprint.height * 0.24, 16]} />
          <meshStandardMaterial color="#7b5b45" roughness={0.86} />
        </mesh>
        {geometryKey === 'plant-minimal' ? (
          <mesh position={[0, footprint.height * 0.18, 0]}>
            <cylinderGeometry args={[0.03, 0.04, footprint.height * 0.9, 10]} />
            <meshStandardMaterial color="#70885f" roughness={0.82} />
          </mesh>
        ) : geometryKey === 'plant-palm' ? (
          <mesh position={[0, footprint.height * 0.26, 0]}>
            <sphereGeometry args={[footprint.width * 0.58, 12, 12]} />
            <meshStandardMaterial color="#7da86f" roughness={0.82} />
          </mesh>
        ) : (
          <mesh position={[0, footprint.height * 0.2, 0]}>
            <sphereGeometry args={[footprint.width * (geometryKey === 'plant-olive' ? 0.38 : 0.5), 16, 16]} />
            <meshStandardMaterial color="#7aa06e" roughness={0.82} />
          </mesh>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('tv-')) {
    geometry = (
      <group>
        <RoundedBox args={[footprint.width, footprint.height * 0.8, geometryKey === 'tv-gallery' ? footprint.depth * 0.7 : footprint.depth]} radius={geometryKey === 'tv-curved' ? 0.18 : 0.04} smoothness={4}>
          <meshStandardMaterial color="#2a3138" roughness={0.4} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0, -footprint.height * 0.48, 0]}>
          <boxGeometry args={[0.18, footprint.height * 0.18, 0.08]} />
          <meshStandardMaterial color="#3f454a" roughness={0.85} />
        </mesh>
        {geometryKey === 'tv-frame' && (
          <mesh>
            <boxGeometry args={[footprint.width * 1.02, footprint.height * 0.84, footprint.depth * 1.3]} />
            <meshStandardMaterial color="#6d574a" roughness={0.86} />
          </mesh>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('rug-') || geometryKey.startsWith('textile-')) {
    geometry = (
      <mesh position={[0, -footprint.height * 0.48, 0]}>
        <boxGeometry args={[footprint.width, geometryKey === 'textile-draped' ? footprint.height * 0.16 : 0.05, footprint.depth]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
    );
  }

  if (geometryKey.startsWith('bed-')) {
    geometry = (
      <group>
        <RoundedBox args={[footprint.width, footprint.height * 0.26, footprint.depth]} radius={0.06} smoothness={4} position={[0, -footprint.height * 0.18, 0]}>
          {material}
        </RoundedBox>
        <RoundedBox args={[footprint.width * 0.94, footprint.height * 0.12, footprint.depth * 0.92]} radius={0.04} smoothness={4} position={[0, -footprint.height * 0.02, 0]}>
          <meshStandardMaterial color={palette.ceiling} roughness={0.96} />
        </RoundedBox>
        {geometryKey !== 'bed-low' && (
          <RoundedBox args={[footprint.width, footprint.height * (geometryKey === 'bed-sleigh' ? 0.34 : 0.28), footprint.depth * 0.08]} radius={0.04} smoothness={4} position={[0, footprint.height * 0.12, -footprint.depth * 0.46]}>
            {material}
          </RoundedBox>
        )}
        {geometryKey === 'bed-canopy' && (
          <>
            {[
              [-footprint.width * 0.44, footprint.height * 0.5, -footprint.depth * 0.44],
              [footprint.width * 0.44, footprint.height * 0.5, -footprint.depth * 0.44],
              [-footprint.width * 0.44, footprint.height * 0.5, footprint.depth * 0.44],
              [footprint.width * 0.44, footprint.height * 0.5, footprint.depth * 0.44],
            ].map((position, index) => (
              <mesh key={index} position={position}>
                <boxGeometry args={[0.05, footprint.height, 0.05]} />
                <meshStandardMaterial {...accentMaterialProps} />
              </mesh>
            ))}
          </>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('table-') || geometryKey.startsWith('desk-')) {
    geometry = (
      <group>
        <RoundedBox args={[footprint.width, footprint.height * 0.12, footprint.depth]} radius={0.04} smoothness={4} position={[0, footprint.height * 0.18, 0]}>
          {material}
        </RoundedBox>
        {geometryKey.includes('pedestal') ? (
          <mesh position={[0, -footprint.height * 0.02, 0]}>
            <cylinderGeometry args={[footprint.width * 0.12, footprint.width * 0.18, footprint.height * 0.56, 16]} />
            <meshStandardMaterial {...accentMaterialProps} />
          </mesh>
        ) : geometryKey.includes('trestle') ? (
          <>
            {[-footprint.width * 0.24, footprint.width * 0.24].map((x) => (
              <mesh key={x} position={[x, -footprint.height * 0.04, 0]}>
                <boxGeometry args={[footprint.width * 0.08, footprint.height * 0.52, footprint.depth * 0.62]} />
                <meshStandardMaterial {...accentMaterialProps} />
              </mesh>
            ))}
          </>
        ) : geometryKey.includes('waterfall') ? (
          <>
            {[-footprint.width * 0.42, footprint.width * 0.42].map((x) => (
              <mesh key={x} position={[x, -footprint.height * 0.04, 0]}>
                <boxGeometry args={[footprint.width * 0.08, footprint.height * 0.54, footprint.depth]} />
                {material}
              </mesh>
            ))}
          </>
        ) : (
          <>
            {[-footprint.width * 0.38, footprint.width * 0.38].map((x) =>
              [-footprint.depth * 0.38, footprint.depth * 0.38].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, -footprint.height * 0.04, z]}>
                  <boxGeometry args={[0.06, footprint.height * 0.54, 0.06]} />
                  <meshStandardMaterial {...accentMaterialProps} />
                </mesh>
              ))
            )}
          </>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('cabinet-') || geometryKey.startsWith('wardrobe-') || geometryKey.startsWith('shelf-') || geometryKey.startsWith('appliance-')) {
    const bodyHeight = geometryKey.startsWith('shelf-') ? footprint.height * 0.94 : footprint.height;
    geometry = (
      <group>
        <RoundedBox args={[footprint.width, bodyHeight, footprint.depth]} radius={geometryKey.includes('rounded') || geometryKey.includes('arched') ? 0.16 : 0.05} smoothness={4} position={[0, bodyHeight * 0.02, 0]}>
          {material}
        </RoundedBox>
        {(geometryKey.startsWith('shelf-') || geometryKey.includes('fluted') || geometryKey.includes('open')) && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[footprint.width * 0.92, bodyHeight * 0.82, footprint.depth * 0.86]} />
            <meshStandardMaterial color={palette.ceiling} roughness={0.94} />
          </mesh>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('mirror-') || geometryKey.startsWith('wall-')) {
    geometry = (
      <group>
        <mesh>
          {geometryKey.includes('round') ? (
            <cylinderGeometry args={[footprint.width * 0.48, footprint.width * 0.48, Math.max(0.03, footprint.depth), 24]} />
          ) : (
            <boxGeometry args={[footprint.width, footprint.height, Math.max(0.03, footprint.depth)]} />
          )}
          <meshStandardMaterial color={palette.panelSoft} metalness={0.25} roughness={0.24} />
        </mesh>
        {geometryKey === 'mirror-backlit' && (
          <mesh scale={[1.08, 1.08, 1.4]}>
            <boxGeometry args={[footprint.width, footprint.height, Math.max(0.02, footprint.depth)]} />
            <meshStandardMaterial color={palette.highlight} transparent opacity={0.24} />
          </mesh>
        )}
      </group>
    );
  }

  if (geometryKey.startsWith('bathtub-') || geometryKey.startsWith('shower-') || geometryKey.startsWith('toilet-') || geometryKey.startsWith('sink-') || geometryKey.startsWith('stair-') || geometryKey.startsWith('decor-')) {
    geometry = (
      <RoundedBox args={[footprint.width, footprint.height, footprint.depth]} radius={geometryKey.includes('oval') || geometryKey.includes('sculptural') ? 0.18 : 0.06} smoothness={4}>
        {material}
      </RoundedBox>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[room.x + item.x, footprint.height / 2, room.z + item.z]}
      rotation={[0, item.rotation, 0]}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelectItem(room.id, item.id);
        onStartDrag?.(event, room, item, footprint);
      }}
    >
      {geometry}
      {selected && (
        <Html position={[0, footprint.height + 0.4, 0]} center>
          <div className="scene-tag">{CATALOG_BY_ID[item.catalogId]?.label ?? item.label}</div>
        </Html>
      )}
    </group>
  );
}

function RoomMesh({ room, palette, selection, onSelectRoom, onSelectItem, onSelectWall, onStartDrag, activeRoomId, draggingItemId, mode }) {
  const hiddenWall = useHiddenWall(room, room.id === activeRoomId, mode);
  const isSelected = selection?.kind === 'room' && selection.roomId === room.id;

  return (
    <group>
      <mesh
        position={[room.x + room.width / 2, 0, room.z + room.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelectRoom(room.id);
        }}
      >
        <planeGeometry args={[room.width, room.depth]} />
        <meshStandardMaterial
          color={palette.floor}
          roughness={0.94}
          emissive={isSelected ? palette.highlight : '#000000'}
          emissiveIntensity={isSelected ? 0.12 : 0}
        />
      </mesh>

      <mesh position={[room.x + room.width / 2, room.height + 0.03, room.z + room.depth / 2]}>
        <boxGeometry args={[room.width, 0.05, room.depth]} />
        <meshStandardMaterial color={palette.ceiling} transparent opacity={0.14} />
      </mesh>

      {['north', 'east', 'south', 'west'].map((wall) => (
        <RoomWall
          key={`${room.id}-${wall}`}
          room={room}
          wall={wall}
          color={palette.wall}
          hiddenWall={hiddenWall}
          onSelectWall={onSelectWall}
          active={selection?.kind === 'wall' && selection.roomId === room.id && selection.wall === wall}
        />
      ))}

      <Html position={[room.x + room.width / 2, room.height + 0.7, room.z + room.depth / 2]} center>
        <div className={`room-badge ${room.id === activeRoomId ? 'active' : ''}`}>
          <strong>{room.label}</strong>
          <small>{room.width * room.depth} m²</small>
        </div>
      </Html>

      {room.items.map((item) => (
        <ItemMesh
          key={item.id}
          item={item}
          room={room}
          palette={palette}
          selected={selection?.kind === 'item' && selection.itemId === item.id}
          dragging={draggingItemId === item.id}
          onSelectItem={onSelectItem}
          onStartDrag={onStartDrag}
        />
      ))}
    </group>
  );
}

const PlannerScene = forwardRef(function PlannerScene(
  { floor, selection, palette, lighting, mode, onSelectRoom, onSelectItem, onSelectWall, onMoveItem, activeRoomId, readOnly = false },
  ref
) {
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const focus = useMemo(() => {
    const rooms = floor.rooms;
    const maxX = Math.max(...rooms.map((room) => room.x + room.width));
    const maxZ = Math.max(...rooms.map((room) => room.z + room.depth));
    return [maxX / 2, 1, maxZ / 2];
  }, [floor.rooms]);
  const planeSize = useMemo(() => [focus[0] * 2 + 12, focus[2] * 2 + 12], [focus]);

  useImperativeHandle(ref, () => ({
    exportPng() {
      const canvas = canvasRef.current?.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : null;
    },
  }));

  const controlsEnabled = !dragState;

  const handleStartDrag = (event, room, item, footprint) => {
    if (readOnly || item.locked || !onMoveItem) {
      return;
    }

    const itemWorldX = room.x + item.x;
    const itemWorldZ = room.z + item.z;
    setDragState({
      roomId: room.id,
      itemId: item.id,
      offsetX: event.point.x - itemWorldX,
      offsetZ: event.point.z - itemWorldZ,
      footprint,
    });
  };

  const handleDragMove = (event) => {
    if (!dragState || !onMoveItem) {
      return;
    }

    event.stopPropagation();
    const room = floor.rooms.find((entry) => entry.id === dragState.roomId);
    if (!room) {
      return;
    }

    const nextX = event.point.x - room.x - dragState.offsetX;
    const nextZ = event.point.z - room.z - dragState.offsetZ;
    onMoveItem(room.id, dragState.itemId, nextX, nextZ);
  };

  const stopDragging = () => {
    if (dragState) {
      setDragState(null);
    }
  };

  return (
    <div ref={canvasRef} className="planner-scene">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }} onPointerMissed={stopDragging}>
        <color attach="background" args={[palette.background]} />
        <fog attach="fog" args={[palette.background, 10, 48]} />
        <SceneCamera mode={mode} focus={focus} controlsEnabled={controlsEnabled} />
        <ambientLight intensity={lighting.ambient} color={lighting.tint} />
        <directionalLight
          castShadow
          intensity={lighting.sun}
          color={lighting.tint}
          position={[focus[0] + 10, 14, focus[2] + 9]}
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight intensity={lighting.accent} color={palette.highlight} position={[focus[0], 5, focus[2]]} />

        <mesh receiveShadow position={[focus[0], -0.18, focus[2]]}>
          <boxGeometry args={[focus[0] * 2 + 8, 0.2, focus[2] * 2 + 8]} />
          <meshStandardMaterial color={palette.platform} roughness={0.95} />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[focus[0], 0.01, focus[2]]}
          onPointerMove={handleDragMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
        >
          <planeGeometry args={planeSize} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>

        {floor.rooms.map((room) => (
          <RoomMesh
            key={room.id}
            room={room}
            palette={palette}
            selection={selection}
            onSelectRoom={readOnly ? undefined : onSelectRoom}
            onSelectItem={readOnly ? undefined : onSelectItem}
            onSelectWall={readOnly ? undefined : onSelectWall}
            onStartDrag={handleStartDrag}
            activeRoomId={activeRoomId}
            draggingItemId={dragState?.itemId ?? null}
            mode={mode}
          />
        ))}

        <ContactShadows position={[focus[0], -0.12, focus[2]]} opacity={0.45} scale={40} blur={2.2} far={12} color={palette.shadow} />
      </Canvas>
    </div>
  );
});

export default PlannerScene;
