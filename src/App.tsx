import { useEffect, useRef } from "react";
import { Scene } from "./components/Scene";
import { HandTracker } from "./components/HandTracker";
import { useHandTracking } from "./hooks/useHandTracking";
import { GestureTracker } from "./utils/gesture";
import "./App.css";

function App() {
  const { videoRef, landmarks, ready, error } = useHandTracking();
  const gestureTracker = useRef(new GestureTracker());
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);

  // Process landmarks → gesture → spin
  useEffect(() => {
    if (!landmarks || landmarks.length === 0) return;

    const hand = landmarks[0];
    const tip = hand[8]; // index finger tip
    if (!tip) return;

    gestureTracker.current.addSample(tip.x, tip.y, performance.now());
    const angularVelocity = gestureTracker.current.getAngularVelocity();

    if (angularVelocity !== null) {
      velocityRef.current = angularVelocity;
      gestureTracker.current.clear();
    }
  }, [landmarks]);

  return (
    <div className="app">
      <HandTracker videoRef={videoRef} landmarks={landmarks} ready={ready} />
      <Scene rotationRef={rotationRef} velocityRef={velocityRef} />

      <div className="overlay">
        {error && <div className="error">{error}</div>}

        {!ready && !error && (
          <div className="loading">
            <div className="spinner" />
            <p>Starting camera & loading hand tracking model...</p>
          </div>
        )}

        {ready && (
          <div className="instructions">
            Move your hand in a circular motion to spin the bottle!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
