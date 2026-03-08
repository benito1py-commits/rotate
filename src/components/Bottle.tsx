import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FRICTION = 0.97;
const MIN_VELOCITY = 0.01;

interface BottleProps {
  rotationRef: React.RefObject<number>;
  velocityRef: React.RefObject<number>;
}

export function Bottle({ rotationRef, velocityRef }: BottleProps) {
  const groupRef = useRef<THREE.Group>(null);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2d8c5a",
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    [],
  );

  useFrame((_, delta) => {
    // Spin physics
    if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
      rotationRef.current += velocityRef.current * delta * 10;
      velocityRef.current *= FRICTION;
    } else if (velocityRef.current !== 0) {
      velocityRef.current = 0;
    }

    // Apply rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.3, 0.3, 2, 32]} />
      </mesh>

      {/* Neck taper */}
      <mesh position={[0, 1.3, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.12, 0.3, 0.6, 32]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.9, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 32]} />
      </mesh>

      {/* Lip */}
      <mesh position={[0, 2.35, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.15, 0.12, 0.1, 32]} />
      </mesh>

      {/* Bottom */}
      <mesh position={[0, -1.05, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.28, 0.3, 0.1, 32]} />
      </mesh>
    </group>
  );
}
