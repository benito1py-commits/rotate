import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LogoProps {
  targetX: React.RefObject<number>;
  targetY: React.RefObject<number>;
}

const LERP_FACTOR = 0.08;

export function Logo({ targetX, targetY }: LogoProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp position toward target
    groupRef.current.position.x += (targetX.current - groupRef.current.position.x) * LERP_FACTOR;
    groupRef.current.position.y += (targetY.current - groupRef.current.position.y) * LERP_FACTOR;

    // Slow rotation for visual flair
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.x += delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Icosahedron core */}
      <mesh castShadow>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial
          color="#ff6ec7"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Torus ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#00ccff"
          emissive="#00ccff"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Second ring at angle */}
      <mesh rotation={[0.4, 0.8, 0]} castShadow>
        <torusGeometry args={[1.3, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#ff6ec7"
          emissive="#ff6ec7"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
