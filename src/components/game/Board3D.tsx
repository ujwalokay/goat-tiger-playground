import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { EDGES, NODES, nodePos, type Side } from "@/game/engine";
import { GoatPiece, TigerPiece } from "./Pieces3D";

export const UNIT = 1.15;
export const BOARD_TOP = 0.16;

export type PieceView = { id: string; side: Side; node: number };

export type BoardColors = {
  felt: string;
  table: string;
  goat: string;
  tiger: string;
  glow: boolean;
};

function pos3(node: number, y = BOARD_TOP): [number, number, number] {
  const [x, z] = nodePos(node, UNIT);
  return [x, y, z];
}

function BoardBase({ colors }: { colors: BoardColors }) {
  const half = UNIT * 2 + 0.8;
  return (
    <group>
      {/* wooden frame */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[half * 2, 0.22, half * 2]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.65} />
      </mesh>
      {/* cream paper border */}
      <mesh position={[0, 0.132, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[half * 2 - 0.22, half * 2 - 0.22]} />
        <meshStandardMaterial color="#efe6cd" roughness={0.9} />
      </mesh>
      {/* felt playfield */}
      <mesh receiveShadow position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[UNIT * 4 + 0.55, UNIT * 4 + 0.55]} />
        <meshStandardMaterial color={colors.felt} roughness={0.95} />
      </mesh>
      <BoardLines />
      <Decorations />
    </group>
  );
}

function BoardLines() {
  const lines = useMemo(() => {
    return EDGES.map(([a, b]) => {
      const [ax, az] = nodePos(a, UNIT);
      const [bx, bz] = nodePos(b, UNIT);
      const dx = bx - ax;
      const dz = bz - az;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);
      return { x: (ax + bx) / 2, z: (az + bz) / 2, len, angle, key: `${a}-${b}` };
    });
  }, []);

  return (
    <group>
      {lines.map((l) => (
        <mesh key={l.key} position={[l.x, 0.145, l.z]} rotation={[-Math.PI / 2, 0, -l.angle]}>
          <planeGeometry args={[l.len, 0.045]} />
          <meshBasicMaterial color="#f3c64b" />
        </mesh>
      ))}
    </group>
  );
}

function Decorations() {
  const items = useMemo(() => {
    const out: { x: number; z: number; c: string; r: number }[] = [];
    const palette = ["#e14b64", "#3d7de0", "#f0a92e", "#48b972", "#8b58d6"];
    const band = UNIT * 2 + 0.48;
    const count = 7;
    let k = 0;
    for (let i = 0; i < count; i++) {
      const t = -band + 0.25 + (i / (count - 1)) * (band * 2 - 0.5);
      out.push({ x: t, z: -band, c: palette[k++ % palette.length]!, r: 0 });
      out.push({ x: t, z: band, c: palette[k++ % palette.length]!, r: 0 });
      out.push({ x: -band, z: t, c: palette[k++ % palette.length]!, r: Math.PI / 2 });
      out.push({ x: band, z: t, c: palette[k++ % palette.length]!, r: Math.PI / 2 });
    }
    return out;
  }, []);
  return (
    <group>
      {items.map((d, i) => (
        <mesh key={i} position={[d.x, 0.136, d.z]} rotation={[-Math.PI / 2, 0, d.r]}>
          <planeGeometry args={[0.26, 0.14]} />
          <meshBasicMaterial color={d.c} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Node({
  index,
  highlighted,
  onSelect,
}: {
  index: number;
  highlighted: boolean;
  onSelect?: (i: number) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ring.current) return;
    const k = highlighted ? 1 + Math.sin(s.clock.elapsedTime * 5 + index) * 0.12 : 0.001;
    ring.current.scale.setScalar(k);
  });
  const [x, , z] = pos3(index);
  return (
    <group position={[x, 0.15, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        {...(onSelect ? { onClick: () => onSelect(index) } : {})}
      >
        <circleGeometry args={[0.34, 24]} />
        <meshBasicMaterial transparent opacity={0.001} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.13, 20]} />
        <meshStandardMaterial color="#a9702f" roughness={0.6} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[0.19, 0.25, 28]} />
        <meshBasicMaterial color="#9cf7b6" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CaptureBurst({ node, stamp }: { node: number; stamp: number }) {
  const group = useRef<THREE.Group>(null);
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now();
  }, [stamp]);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = Math.min(1, (performance.now() - start.current) / 700);
    g.visible = t < 1;
    g.children.forEach((c, i) => {
      const a = (i / g.children.length) * Math.PI * 2;
      c.position.set(Math.cos(a) * t * 0.8, 0.2 + t * 0.7, Math.sin(a) * t * 0.8);
      c.scale.setScalar(Math.max(0.001, (1 - t) * 0.12));
    });
  });
  const [x, , z] = pos3(node);
  return (
    <group ref={group} position={[x, 0.15, z]} key={stamp}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={i % 2 ? "#ffd166" : "#ff7b54"} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ signal }: { signal: number }) {
  // Fits the board into the viewport on mount, resize, and reset.
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as { target: THREE.Vector3; update: () => void } | null;
  useEffect(() => {
    const boardRadius = UNIT * 2 + 1.5;
    const aspect = size.width / size.height;
    const vFov = ((camera.fov ?? 42) * Math.PI) / 180;
    let dist = boardRadius / Math.tan(vFov / 2);
    if (aspect < 1) dist /= Math.max(0.45, aspect);
    dist = Math.min(Math.max(dist * 0.8, 8), 20);
    camera.position.set(0, dist * 0.8, dist * 0.62);
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [signal, camera, controls, size.width, size.height]);
  return null;
}

function Scene({
  pieces,
  colors,
  highlights,
  selected,
  onNode,
  burst,
  autoRotate,
  resetSignal,
}: {
  pieces: PieceView[];
  colors: BoardColors;
  highlights: number[];
  selected: number | null;
  onNode?: (i: number) => void;
  burst?: { node: number; stamp: number } | null;
  autoRotate?: boolean;
  resetSignal: number;
}) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.35} color="#ffd9a0" />

      {/* table */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={colors.table} roughness={0.9} />
      </mesh>

      <BoardBase colors={colors} />
      <ContactShadows position={[0, 0.152, 0]} opacity={0.35} scale={9} blur={2.4} far={3} />

      {Array.from({ length: NODES }).map((_, i) => (
        <Node
          key={i}
          index={i}
          highlighted={highlights.includes(i)}
          {...(onNode ? { onSelect: onNode } : {})}
        />
      ))}

      {pieces.map((p, idx) =>
        p.side === "goat" ? (
          <GoatPiece
            key={p.id}
            position={pos3(p.node)}
            color={colors.goat}
            selected={selected === p.node}
            glow={colors.glow}
            seed={idx}
            {...(onNode ? { onClick: () => onNode(p.node) } : {})}
          />
        ) : (
          <TigerPiece
            key={p.id}
            position={pos3(p.node)}
            color={colors.tiger}
            selected={selected === p.node}
            glow={colors.glow}
            seed={idx}
            {...(onNode ? { onClick: () => onNode(p.node) } : {})}
          />
        ),
      )}

      {burst && <CaptureBurst node={burst.node} stamp={burst.stamp} />}

      <OrbitControls
        enablePan={false}
        minPolarAngle={0.35}
        maxPolarAngle={1.05}
        minDistance={6}
        maxDistance={24}
        autoRotate={!!autoRotate}
        autoRotateSpeed={0.9}
        makeDefault
      />
      <CameraRig signal={resetSignal} />
    </>
  );
}

export function Board3D(props: {
  pieces: PieceView[];
  colors: BoardColors;
  highlights?: number[];
  selected?: number | null;
  onNode?: (i: number) => void;
  burst?: { node: number; stamp: number } | null;
  autoRotate?: boolean;
  resetSignal?: number;
  className?: string;
}) {
  const {
    pieces,
    colors,
    highlights = [],
    selected = null,
    onNode,
    burst = null,
    autoRotate,
    resetSignal = 0,
    className,
  } = props;

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 7.6, 7.2], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#2a1a0f"]} />
        <fog attach="fog" args={["#2a1a0f", 14, 26]} />
        <Scene
          pieces={pieces}
          colors={colors}
          highlights={highlights}
          selected={selected}
          burst={burst}
          resetSignal={resetSignal}
          {...(autoRotate ? { autoRotate: true } : {})}
          {...(onNode ? { onNode } : {})}
        />
      </Canvas>
    </div>
  );
}