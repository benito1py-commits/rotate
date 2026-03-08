import { useEffect, useRef } from "react";
import { GameShell } from "../../shared/components/GameShell";
import { Scene } from "./Scene";
import { VelocityTracker, getPinchDistance, PINCH_THRESHOLD } from "./physics";
import type { HandLandmark } from "../../shared/types";

export default function BallThrower() {
  const positionRef = useRef({ x: 0, y: 0, z: 0 });
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const grabbedRef = useRef(false);

  return (
    <GameShell instructions="Pinch your thumb and index finger to grab the ball, release to throw!">
      {(landmarks) => (
        <ThrowLogic
          landmarks={landmarks}
          positionRef={positionRef}
          velocityRef={velocityRef}
          grabbedRef={grabbedRef}
        />
      )}
    </GameShell>
  );
}

function ThrowLogic({
  landmarks,
  positionRef,
  velocityRef,
  grabbedRef,
}: {
  landmarks: HandLandmark[][] | null;
  positionRef: React.RefObject<{ x: number; y: number; z: number }>;
  velocityRef: React.RefObject<{ x: number; y: number; z: number }>;
  grabbedRef: React.RefObject<boolean>;
}) {
  const velocityTracker = useRef(new VelocityTracker());
  const wasPinching = useRef(false);

  useEffect(() => {
    if (!landmarks || landmarks.length === 0) return;

    const hand = landmarks[0];
    const thumb = hand[4]; // thumb tip
    const index = hand[8]; // index tip
    if (!thumb || !index) return;

    const pinchDist = getPinchDistance(thumb, index);
    const isPinching = pinchDist < PINCH_THRESHOLD;

    // Map hand position to 3D coords (midpoint of thumb and index)
    const handX = (1 - (thumb.x + index.x) / 2 - 0.5) * 8;
    const handY = -((thumb.y + index.y) / 2 - 0.5) * 6;

    if (isPinching) {
      if (!wasPinching.current) {
        // Just started pinching - grab
        velocityRef.current = { x: 0, y: 0, z: 0 };
        velocityTracker.current.clear();
      }
      grabbedRef.current = true;
      positionRef.current = { x: handX, y: handY, z: 0 };
      velocityTracker.current.addSample(handX, handY, performance.now());
    } else if (wasPinching.current) {
      // Just released - throw!
      grabbedRef.current = false;
      const vel = velocityTracker.current.getVelocity();
      velocityRef.current = {
        x: vel.vx * 0.8,
        y: vel.vy * 0.8,
        z: 0,
      };
      velocityTracker.current.clear();
    }

    wasPinching.current = isPinching;
  }, [landmarks, positionRef, velocityRef, grabbedRef]);

  return (
    <Scene
      positionRef={positionRef}
      velocityRef={velocityRef}
      grabbedRef={grabbedRef}
    />
  );
}
