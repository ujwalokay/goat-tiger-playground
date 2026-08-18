import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type PieceProps = {
  position: [number, number, number];
  color: string;
  selected?: boolean;
  glow?: boolean;
  onClick?: () => void;
  seed?: number;
};

function useIdle(
  group: React.RefObject<THREE.Group | null>,
  target: [number, number, number],
  seed: number,
  selected?: boolean,
) {
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(0.001, delta);
    g.position.x += (target[0] - g.position.x) * k;
    g.position.z += (target[2] - g.position.z) * k;
    const hop = selected ? 0.16 : 0;
    const bob = Math.sin(t * 1.6 + seed) * 0.02;
    const targetY = target[1] + hop + bob;
    g.position.y += (targetY - g.position.y) * k;
    g.rotation.y = Math.sin(t * 0.8 + seed) * 0.06;
    const s = selected ? 1.12 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);
  });
}

export function GoatPiece({ position, color, selected, glow, onClick, seed = 0 }: PieceProps) {
  const group = useRef<THREE.Group>(null);
  useIdle(group, position, seed, selected);

  return (
    <group ref={group} position={position} onClick={onClick ? () => onClick() : undefined}>
      {/* body */}
      <mesh castShadow position={[0, 0.16, 0]}>
        <capsuleGeometry args={[0.16, 0.16, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* belly patch */}
      <mesh position={[0, 0.15, 0.155]}>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshStandardMaterial color="#f6dcb4" roughness={0.5} />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 0.4, 0.02]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* snout */}
      <mesh position={[0, 0.36, 0.14]}>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshStandardMaterial color="#fff8ec" roughness={0.4} />
      </mesh>
      {/* eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.44, 0.12]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshStandardMaterial color="#2a2118" />
        </mesh>
      ))}
      {/* horns */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.55, -0.02]} rotation={[-0.3, 0, x > 0 ? -0.25 : 0.25]}>
          <coneGeometry args={[0.035, 0.16, 10]} />
          <meshStandardMaterial color="#3f3a33" roughness={0.4} />
        </mesh>
      ))}
      {/* ears */}
      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]} rotation={[0, 0, x > 0 ? -0.6 : 0.6]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
      {(selected || glow) && <PieceGlow color={selected ? "#ffe27a" : "#7de2ff"} />}
    </group>
  );
}

export function TigerPiece({ position, color, selected, glow, onClick, seed = 0 }: PieceProps) {
  const group = useRef<THREE.Group>(null);
  useIdle(group, position, seed, selected);

  return (
    <group ref={group} position={position} onClick={onClick ? () => onClick() : undefined}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <capsuleGeometry args={[0.18, 0.18, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.17, 0.17]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#f3c98b" roughness={0.5} />
      </mesh>
      {/* stripes */}
      {[-0.09, 0.02, 0.13].map((y, i) => (
        <mesh key={i} position={[0, 0.2 + y, -0.13]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.06]} />
          <meshStandardMaterial color="#3b1f10" roughness={0.6} />
        </mesh>
      ))}
      {/* head */}
      <mesh castShadow position={[0, 0.45, 0.02]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.41, 0.15]}>
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial color="#f7d9a8" roughness={0.4} />
      </mesh>
      {[-0.07, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.49, 0.13]}>
          <sphereGeometry args={[0.024, 10, 10]} />
          <meshStandardMaterial color="#241408" />
        </mesh>
      ))}
      {/* face stripes */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.06]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.035, 0.02, 0.1]} />
          <meshStandardMaterial color="#3b1f10" />
        </mesh>
      ))}
      {/* ears */}
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.58, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
      {(selected || glow) && <PieceGlow color={selected ? "#ffb347" : "#7de2ff"} />}
    </group>
  );
}

function PieceGlow({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const p = 0.9 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
    m.scale.setScalar(p);
  });
  return (
    <mesh ref={ref} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.24, 0.34, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}