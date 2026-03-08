import { Canvas } from "@react-three/fiber";
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
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
        />
        <directionalLight position={[-3, 4, -3]} intensity={0.3} />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <circleGeometry args={[4, 64]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
        </mesh>

        <Bottle rotationRef={rotationRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
}
