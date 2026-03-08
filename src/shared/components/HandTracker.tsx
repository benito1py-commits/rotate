import { useEffect, useRef } from "react";
import type { HandLandmark } from "../types";

interface HandTrackerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarks: HandLandmark[][] | null;
  ready: boolean;
}

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // index
  [0, 9], [9, 10], [10, 11], [11, 12],  // middle
  [0, 13], [13, 14], [14, 15], [15, 16], // ring
  [0, 17], [17, 18], [18, 19], [19, 20], // pinky
  [5, 9], [9, 13], [13, 17],             // palm
];

export function HandTracker({ videoRef, landmarks, ready }: HandTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrored video
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.globalAlpha = 1;

    if (!landmarks) return;

    for (const hand of landmarks) {
      // Draw connections
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;
      for (const [a, b] of CONNECTIONS) {
        const pa = hand[a];
        const pb = hand[b];
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo((1 - pa.x) * canvas.width, pa.y * canvas.height);
        ctx.lineTo((1 - pb.x) * canvas.width, pb.y * canvas.height);
        ctx.stroke();
      }

      // Draw landmarks
      for (const point of hand) {
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(
          (1 - point.x) * canvas.width,
          point.y * canvas.height,
          4,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      // Highlight index finger tip (landmark 8)
      const tip = hand[8];
      if (tip) {
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc(
          (1 - tip.x) * canvas.width,
          tip.y * canvas.height,
          8,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
  }, [landmarks, videoRef, ready]);

  return (
    <>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hand-canvas" />
    </>
  );
}
