import { useEffect, useRef, useState, useCallback } from "react";
import {
  HandLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import type { HandLandmark } from "../types";

export type { HandLandmark };

export function useHandTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const [landmarks, setLandmarks] = useState<HandLandmark[][] | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastTimeRef = useRef(-1);

  const init = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      handLandmarkerRef.current = handLandmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize");
    }
  }, []);

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      handLandmarkerRef.current?.close();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, [init]);

  useEffect(() => {
    if (!ready) return;

    const detect = () => {
      const video = videoRef.current;
      const handLandmarker = handLandmarkerRef.current;

      if (video && handLandmarker && video.readyState >= 2) {
        const now = performance.now();
        if (now !== lastTimeRef.current) {
          lastTimeRef.current = now;
          const result = handLandmarker.detectForVideo(video, now);
          if (result.landmarks && result.landmarks.length > 0) {
            setLandmarks(result.landmarks);
          } else {
            setLandmarks(null);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [ready]);

  return { videoRef, landmarks, ready, error };
}
