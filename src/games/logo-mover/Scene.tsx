import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Logo } from "./Logo";

interface SceneProps {
  targetX: React.RefObject<number>;
  targetY: React.RefObject<number>;
}

export function Scene({ targetX, targetY }: SceneProps) {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff6ec7" />

        <Logo targetX={targetX} targetY={targetY} />
      </Canvas>
    </div>
  );
}
