import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GRAVITY = -9.8;
const FLOOR_Y = -1.5;
const RESET_DELAY = 2; // seconds after hitting floor

interface BallProps {
  positionRef: React.RefObject<{ x: number; y: number; z: number }>;
  velocityRef: React.RefObject<{ x: number; y: number; z: number }>;
  grabbedRef: React.RefObject<boolean>;
}

export function Ball({ positionRef, velocityRef, grabbedRef }: BallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const resetTimer = useRef(0);
  const landed = useRef(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (grabbedRef.current) {
      // Follow hand position
      meshRef.current.position.set(
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z
      );
      landed.current = false;
      resetTimer.current = 0;
    } else {
      // Apply physics
      if (!landed.current) {
        velocityRef.current.y += GRAVITY * delta;
        positionRef.current.x += velocityRef.current.x * delta;
        positionRef.current.y += velocityRef.current.y * delta;
        positionRef.current.z += velocityRef.current.z * delta;

        // Floor collision
        if (positionRef.current.y <= FLOOR_Y) {
          positionRef.current.y = FLOOR_Y;
          velocityRef.current = { x: 0, y: 0, z: 0 };
          landed.current = true;
        }
      } else {
        // Reset after delay
        resetTimer.current += delta;
        if (resetTimer.current >= RESET_DELAY) {
          positionRef.current = { x: 0, y: 0, z: 0 };
          velocityRef.current = { x: 0, y: 0, z: 0 };
          landed.current = false;
          resetTimer.current = 0;
        }
      }

      meshRef.current.position.set(
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z
      );
    }

    // Spin the ball for visual effect
    meshRef.current.rotation.x += delta * 2;
    meshRef.current.rotation.z += delta * 1.5;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color="#ff6600"
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}
