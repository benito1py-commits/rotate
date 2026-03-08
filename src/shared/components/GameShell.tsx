import { useNavigate } from "react-router-dom";
import { HandTracker } from "./HandTracker";
import { useHandTracking } from "../hooks/useHandTracking";
import type { HandLandmark } from "../types";

interface GameShellProps {
  instructions: string;
  children: (landmarks: HandLandmark[][] | null) => React.ReactNode;
}

export function GameShell({ instructions, children }: GameShellProps) {
  const { videoRef, landmarks, ready, error } = useHandTracking();
  const navigate = useNavigate();

  return (
    <div className="app">
      <HandTracker videoRef={videoRef} landmarks={landmarks} ready={ready} />
      {children(landmarks)}

      <div className="overlay">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>

        {error && <div className="error">{error}</div>}

        {!ready && !error && (
          <div className="loading">
            <div className="spinner" />
            <p>Starting camera & loading hand tracking model...</p>
          </div>
        )}

        {ready && (
          <div className="instructions">{instructions}</div>
        )}
      </div>
    </div>
  );
}
