import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface LogoProps {
  targetX: React.RefObject<number>;
  targetY: React.RefObject<number>;
}

const LERP_FACTOR = 0.08;

useGLTF.preload("/logo.glb");

export function Logo({ targetX, targetY }: LogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/logo.glb");

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp position toward target
    groupRef.current.position.x += (targetX.current - groupRef.current.position.x) * LERP_FACTOR;
    groupRef.current.position.y += (targetY.current - groupRef.current.position.y) * LERP_FACTOR;

    // Slow rotation for visual flair
    groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} castShadow />
    </group>
  );
}
