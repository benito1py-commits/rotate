import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Ball } from "./Ball";

interface SceneProps {
  positionRef: React.RefObject<{ x: number; y: number; z: number }>;
  velocityRef: React.RefObject<{ x: number; y: number; z: number }>;
  grabbedRef: React.RefObject<boolean>;
}

export function Scene({ positionRef, velocityRef, grabbedRef }: SceneProps) {
  return (
    <div className="scene-container">
      <Canvas
        shadows
        camera={{ position: [0, 1, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 4, -3]} intensity={0.3} />

        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2a2a4a" roughness={0.9} />
        </mesh>

        <Ball
          positionRef={positionRef}
          velocityRef={velocityRef}
          grabbedRef={grabbedRef}
        />
      </Canvas>
    </div>
  );
}
