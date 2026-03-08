import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FloatingLogoProps {
  handX: React.RefObject<number>;
  handY: React.RefObject<number>;
  handActive: React.RefObject<boolean>;
}

// Boundaries in scene units
const BOUND_X = 5.5;
const BOUND_Y = 3.8;

// Push force radius — how close the finger needs to be
const PUSH_RADIUS = 1.2;
const PUSH_STRENGTH = 12;

// Water-like physics
const DRAG = 0.97;          // fluid resistance
const DRIFT_STRENGTH = 0.15; // gentle ambient currents
const BOB_SPEED = 0.8;       // bobbing frequency
const BOB_AMOUNT = 0.08;     // bobbing amplitude
const BOUNCE = 0.5;          // wall bounce damping

useGLTF.preload("/logo.glb");

export function FloatingLogo({ handX, handY, handActive }: FloatingLogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/logo.glb");

  // Physics state stored in refs so they persist across frames
  const vx = useRef(0.3);
  const vy = useRef(0.2);
  const time = useRef(Math.random() * 100);
  const rotVelY = useRef(0.3);
  const rotVelX = useRef(0.1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05); // clamp for tab-away spikes
    time.current += dt;

    const pos = groupRef.current.position;

    // Gentle drift currents (slowly changing direction)
    const driftAngle = Math.sin(time.current * 0.2) * Math.PI;
    vx.current += Math.cos(driftAngle) * DRIFT_STRENGTH * dt;
    vy.current += Math.sin(driftAngle) * DRIFT_STRENGTH * dt;

    // Hand push force
    if (handActive.current) {
      const dx = pos.x - handX.current;
      const dy = pos.y - handY.current;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PUSH_RADIUS && dist > 0.01) {
        // Push away from hand — stronger when closer
        const force = (1 - dist / PUSH_RADIUS) * PUSH_STRENGTH;
        const nx = dx / dist;
        const ny = dy / dist;
        vx.current += nx * force * dt;
        vy.current += ny * force * dt;

        // Add spin on push
        rotVelY.current += nx * force * dt * 0.5;
        rotVelX.current += ny * force * dt * 0.3;
      }
    }

    // Fluid drag
    vx.current *= DRAG;
    vy.current *= DRAG;
    rotVelY.current *= 0.995;
    rotVelX.current *= 0.995;

    // Minimum rotation so it always looks alive
    if (Math.abs(rotVelY.current) < 0.2) rotVelY.current = 0.2;

    // Update position
    pos.x += vx.current * dt;
    pos.y += vy.current * dt;

    // Bobbing — gentle sinusoidal float
    pos.y += Math.sin(time.current * BOB_SPEED) * BOB_AMOUNT * dt;

    // Bounce off walls
    if (pos.x > BOUND_X) { pos.x = BOUND_X; vx.current *= -BOUNCE; }
    if (pos.x < -BOUND_X) { pos.x = -BOUND_X; vx.current *= -BOUNCE; }
    if (pos.y > BOUND_Y) { pos.y = BOUND_Y; vy.current *= -BOUNCE; }
    if (pos.y < -BOUND_Y) { pos.y = -BOUND_Y; vy.current *= -BOUNCE; }

    // Rotation
    groupRef.current.rotation.y += rotVelY.current * dt;
    groupRef.current.rotation.x += rotVelX.current * dt;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone()} scale={1.5} castShadow />
    </group>
  );
}
