import { useEffect, useRef } from "react";
import { GameShell } from "../../shared/components/GameShell";
import { Scene } from "./Scene";
import type { HandLandmark } from "../../shared/types";

export default function ZeroGravity() {
  const handX = useRef(0);
  const handY = useRef(0);
  const handActive = useRef(false);

  return (
    <GameShell instructions="Toca el logo con el dedo para empujarlo">
      {(landmarks) => (
        <ZeroGravityLogic landmarks={landmarks} handX={handX} handY={handY} handActive={handActive} />
      )}
    </GameShell>
  );
}

function ZeroGravityLogic({
  landmarks,
  handX,
  handY,
  handActive,
}: {
  landmarks: HandLandmark[][] | null;
  handX: React.RefObject<number>;
  handY: React.RefObject<number>;
  handActive: React.RefObject<boolean>;
}) {
  useEffect(() => {
    if (!landmarks || landmarks.length === 0) {
      handActive.current = false;
      return;
    }

    const hand = landmarks[0];
    const tip = hand[8]; // index finger tip
    if (!tip) {
      handActive.current = false;
      return;
    }

    handX.current = (1 - tip.x - 0.5) * 8;
    handY.current = -(tip.y - 0.5) * 6;
    handActive.current = true;
  }, [landmarks, handX, handY, handActive]);

  return <Scene handX={handX} handY={handY} handActive={handActive} />;
}
