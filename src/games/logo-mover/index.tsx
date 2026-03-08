import { useEffect, useRef } from "react";
import { GameShell } from "../../shared/components/GameShell";
import { Scene } from "./Scene";
import type { HandLandmark } from "../../shared/types";

export default function LogoMover() {
  const targetX = useRef(0);
  const targetY = useRef(0);

  return (
    <GameShell instructions="Point your index finger to move the logo around!">
      {(landmarks) => (
        <MoverLogic landmarks={landmarks} targetX={targetX} targetY={targetY} />
      )}
    </GameShell>
  );
}

function MoverLogic({
  landmarks,
  targetX,
  targetY,
}: {
  landmarks: HandLandmark[][] | null;
  targetX: React.RefObject<number>;
  targetY: React.RefObject<number>;
}) {
  useEffect(() => {
    if (!landmarks || landmarks.length === 0) return;

    const hand = landmarks[0];
    const tip = hand[8]; // index finger tip
    if (!tip) return;

    // Map normalized hand position (0-1) to 3D scene coordinates
    // Mirror X since webcam is mirrored, center at 0
    targetX.current = (1 - tip.x - 0.5) * 8;
    targetY.current = -(tip.y - 0.5) * 6;
  }, [landmarks, targetX, targetY]);

  return <Scene targetX={targetX} targetY={targetY} />;
}
