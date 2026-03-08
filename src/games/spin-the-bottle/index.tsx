import { useEffect, useRef } from "react";
import { GameShell } from "../../shared/components/GameShell";
import { GestureTracker } from "./gesture";
import { Scene } from "./Scene";

export default function SpinTheBottle() {
  const gestureTracker = useRef(new GestureTracker());
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);

  return (
    <GameShell instructions="Move your hand in a circular motion to spin the bottle!">
      {(landmarks) => {
        return (
          <SpinLogic
            landmarks={landmarks}
            gestureTracker={gestureTracker}
            velocityRef={velocityRef}
            rotationRef={rotationRef}
          />
        );
      }}
    </GameShell>
  );
}

function SpinLogic({
  landmarks,
  gestureTracker,
  velocityRef,
  rotationRef,
}: {
  landmarks: Parameters<Parameters<typeof GameShell>[0]["children"]>[0];
  gestureTracker: React.RefObject<GestureTracker>;
  velocityRef: React.RefObject<number>;
  rotationRef: React.RefObject<number>;
}) {
  useEffect(() => {
    if (!landmarks || landmarks.length === 0) return;

    const hand = landmarks[0];
    const tip = hand[8];
    if (!tip) return;

    gestureTracker.current.addSample(tip.x, tip.y, performance.now());
    const angularVelocity = gestureTracker.current.getAngularVelocity();

    if (angularVelocity !== null) {
      velocityRef.current = angularVelocity;
      gestureTracker.current.clear();
    }
  }, [landmarks, gestureTracker, velocityRef]);

  return <Scene rotationRef={rotationRef} velocityRef={velocityRef} />;
}
