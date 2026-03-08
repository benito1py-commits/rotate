import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Bottle } from "./Bottle";

interface SceneProps {
  rotationRef: React.RefObject<number>;
  velocityRef: React.RefObject<number>;
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

        <Bottle rotationRef={rotationRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
}
