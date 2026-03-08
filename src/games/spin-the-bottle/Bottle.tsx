import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

const FRICTION = 0.97;
const MIN_VELOCITY = 0.01;

interface BottleProps {
  rotationRef: React.RefObject<number>;
  velocityRef: React.RefObject<number>;
}

function createSpriteLabel(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#006b3f");
  grad.addColorStop(0.5, "#008c4a");
  grad.addColorStop(1, "#006b3f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#c8e600";
  ctx.fillRect(0, 20, 512, 8);
  ctx.fillRect(0, 228, 512, 8);

  ctx.fillStyle = "#c8e600";
  ctx.font = "bold 80px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Sprite", 256, 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText("Lemon-Lime", 256, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export function Bottle({ rotationRef, velocityRef }: BottleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Group>(null);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2d8a4e",
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        transmission: 0.6,
        thickness: 0.5,
        ior: 1.52,
        envMapIntensity: 1.5,
        attenuationColor: new THREE.Color("#1a5c30"),
        attenuationDistance: 2.0,
      }),
    [],
  );

  const labelMaterial = useMemo(() => {
    const texture = createSpriteLabel();
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
  }, []);

  const capMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#007a3d",
        roughness: 0.2,
        metalness: 0.6,
      }),
    [],
  );

  const liquidMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#b8e986",
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.0,
        transmission: 0.4,
        thickness: 0.3,
        ior: 1.33,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
      rotationRef.current += velocityRef.current * delta * 10;
      velocityRef.current *= FRICTION;
    } else if (velocityRef.current !== 0) {
      velocityRef.current = 0;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationRef.current;
    }

    // Toggle sparkles visibility based on spin speed
    if (sparklesRef.current) {
      sparklesRef.current.visible = Math.abs(velocityRef.current) > 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.38, 0.35, 0.1, 32]} />
      </mesh>
      {/* Lower body */}
      <mesh position={[0, 0.6, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.38, 0.38, 1.0, 32]} />
      </mesh>
      {/* Label section */}
      <mesh position={[0, 1.5, 0]} castShadow material={labelMaterial}>
        <cylinderGeometry args={[0.37, 0.38, 0.8, 32]} />
      </mesh>
      {/* Upper body */}
      <mesh position={[0, 2.15, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.35, 0.37, 0.5, 32]} />
      </mesh>
      {/* Shoulder */}
      <mesh position={[0, 2.65, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.15, 0.35, 0.5, 32]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 3.15, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.13, 0.15, 0.5, 32]} />
      </mesh>
      {/* Lip ring */}
      <mesh position={[0, 3.35, 0]} castShadow material={glassMaterial}>
        <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 3.55, 0]} castShadow material={capMaterial}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 3.66, 0]} castShadow material={capMaterial}>
        <sphereGeometry args={[0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Liquid inside - lower body */}
      <mesh position={[0, 0.6, 0]} material={liquidMaterial}>
        <cylinderGeometry args={[0.34, 0.34, 0.95, 32]} />
      </mesh>
      {/* Liquid inside - label area */}
      <mesh position={[0, 1.35, 0]} material={liquidMaterial}>
        <cylinderGeometry args={[0.34, 0.34, 0.5, 32]} />
      </mesh>
      {/* Liquid surface disc */}
      <mesh
        position={[0, 1.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={liquidMaterial}
      >
        <circleGeometry args={[0.34, 32]} />
      </mesh>

      {/* Sparkles - visible only when spinning fast */}
      <group ref={sparklesRef} visible={false}>
        <Sparkles
          count={40}
          scale={[1.5, 4, 1.5]}
          size={3}
          speed={0.8}
          color="#c8e600"
          position={[0, 1.8, 0]}
        />
      </group>
    </group>
  );
}
