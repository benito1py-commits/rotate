import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Bottle } from "./Bottle";

interface SceneProps {
  rotationRef: React.RefObject<number>;
  velocityRef: React.RefObject<number>;
}

function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base wood color
  ctx.fillStyle = "#8B5E3C";
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain lines
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 512;
    const alpha = 0.05 + Math.random() * 0.1;
    ctx.strokeStyle = `rgba(60, 30, 10, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 512; x += 20) {
      ctx.lineTo(x, y + Math.sin(x * 0.02) * 8 + (Math.random() - 0.5) * 4);
    }
    ctx.stroke();
  }

  // Wood knots
  for (let i = 0; i < 3; i++) {
    const kx = 80 + Math.random() * 352;
    const ky = 80 + Math.random() * 352;
    const kr = 10 + Math.random() * 20;
    const grad = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
    grad.addColorStop(0, "rgba(50, 25, 8, 0.4)");
    grad.addColorStop(0.6, "rgba(70, 35, 12, 0.2)");
    grad.addColorStop(1, "rgba(139, 94, 60, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr * 1.3, kr, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function WoodTable() {
  const woodTexture = useMemo(() => createWoodTexture(), []);

  return (
    <group>
      {/* Table surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          map={woodTexture}
          roughness={0.7}
          metalness={0.05}
          color="#8B5E3C"
        />
      </mesh>

      {/* Table edge (cylinder for depth) */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.3, 64, 1, true]} />
        <meshStandardMaterial color="#6B3F22" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Top bevel (torus) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[4, 0.04, 8, 64]} />
        <meshStandardMaterial color="#7A4E2D" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function Scene({ rotationRef, velocityRef }: SceneProps) {
  return (
    <div className="scene-container">
      <Canvas
        shadows
        camera={{ position: [0, 3, 6.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        {/* Environment map for realistic reflections (no background) */}
        <Environment preset="lobby" environmentIntensity={0.4} />

        {/* Ambient - reduced since Environment covers ambient */}
        <ambientLight intensity={0.3} />

        {/* Key light - warm, high-res shadows */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
        />

        {/* Fill light - cool from the left */}
        <directionalLight
          position={[-4, 4, -2]}
          intensity={0.3}
          color="#cce0ff"
        />

        {/* Rim light - behind for silhouette highlights */}
        <directionalLight
          position={[0, 3, -6]}
          intensity={0.5}
          color="#ffffff"
        />

        {/* Warm point light near the table */}
        <pointLight
          position={[0, 1, 2]}
          intensity={0.4}
          color="#ffd699"
          distance={8}
          decay={2}
        />

        {/* Contact shadows for soft diffuse shadows on table */}
        <ContactShadows
          position={[0, -0.04, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
          resolution={256}
          color="#3a1f0a"
        />

        <WoodTable />

        <Bottle rotationRef={rotationRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
}
