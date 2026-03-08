import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLogo } from "./FloatingLogo";

interface SceneProps {
  handX: React.RefObject<number>;
  handY: React.RefObject<number>;
  handActive: React.RefObject<boolean>;
}

export function Scene({ handX, handY, handActive }: SceneProps) {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -3]} intensity={0.2} color="#8888ff" />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#00f0ff" />

        <FloatingLogo handX={handX} handY={handY} handActive={handActive} />
      </Canvas>
    </div>
  );
}
