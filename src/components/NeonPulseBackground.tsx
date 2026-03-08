import { useEffect, useRef } from "react";

// Lightweight Neon Pulse particle background for the catalog page
// Uses Canvas API directly — no external dependencies

interface Attractor {
  x: number;
  y: number;
  phase: number;
  freq: number;
  radius: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  prevX: number;
  prevY: number;
  colorIndex: number;
  baseSpeed: number;
  noiseOffset: number;
  size: number;
  life: number;
  maxLife: number;
  orbitTendency: number;
}

const COLORS = [
  [255, 45, 149],   // hot pink
  [0, 240, 255],    // electric cyan
  [170, 68, 255],   // ultra violet
  [57, 255, 20],    // acid green
];

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Permutation table for value noise
const PERM = new Uint8Array(512);
function initPerm(seed: number) {
  const r = mulberry32(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad3d(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise3d(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y), zf = z - Math.floor(z);
  const u = fade(xf), v = fade(yf), w = fade(zf);
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;
  return lerp(
    lerp(lerp(grad3d(PERM[AA], xf, yf, zf), grad3d(PERM[BA], xf - 1, yf, zf), u),
         lerp(grad3d(PERM[AB], xf, yf - 1, zf), grad3d(PERM[BB], xf - 1, yf - 1, zf), u), v),
    lerp(lerp(grad3d(PERM[AA + 1], xf, yf, zf - 1), grad3d(PERM[BA + 1], xf - 1, yf, zf - 1), u),
         lerp(grad3d(PERM[AB + 1], xf, yf - 1, zf - 1), grad3d(PERM[BB + 1], xf - 1, yf - 1, zf - 1), u), v), w);
}

export function NeonPulseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Initialize system
    initPerm(42);
    const rng = mulberry32(42);
    const PARTICLE_COUNT = Math.min(200, Math.floor(w * h / 5000));
    let time = 0;
    const pulseSpeed = 0.02;
    const noiseScale = 0.003;
    const attractorStrength = 1.5;
    const trailFade = 18;

    // Create attractors
    const attractors: Attractor[] = [];
    const numAttractors = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < numAttractors; i++) {
      attractors.push({
        x: rng() * w * 0.7 + w * 0.15,
        y: rng() * h * 0.7 + h * 0.15,
        phase: rng() * Math.PI * 2,
        freq: rng() * 0.9 + 0.3,
        radius: rng() * 120 + 60,
      });
    }

    // Create particles
    const particles: Particle[] = [];
    function spawnParticle(): Particle {
      const edge = Math.floor(rng() * 4);
      let x: number, y: number;
      if (edge === 0) { x = rng() * w; y = -10; }
      else if (edge === 1) { x = w + 10; y = rng() * h; }
      else if (edge === 2) { x = rng() * w; y = h + 10; }
      else { x = -10; y = rng() * h; }

      const life = 200 + rng() * 400;
      return {
        x, y, vx: 0, vy: 0, prevX: x, prevY: y,
        colorIndex: Math.floor(rng() * COLORS.length),
        baseSpeed: 0.5 + rng() * 2,
        noiseOffset: rng() * 1000,
        size: 1 + rng() * 2.5,
        life, maxLife: life,
        orbitTendency: 0.2 + rng() * 0.6,
      };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start scattered for immediate visual
      const p = spawnParticle();
      p.x = rng() * w;
      p.y = rng() * h;
      p.prevX = p.x;
      p.prevY = p.y;
      particles.push(p);
    }

    // Animation loop
    function frame() {
      // Trail fade
      ctx!.fillStyle = `rgba(10, 10, 26, ${trailFade / 255})`;
      ctx!.fillRect(0, 0, w, h);

      time += pulseSpeed;
      const bassPulse = Math.sin(time) * 0.5 + 0.5;
      const kickPulse = Math.pow(Math.sin(time * 2.17), 8);

      // Draw attractor glows
      for (const a of attractors) {
        const pulse = Math.sin(time * a.freq + a.phase) * 0.5 + 0.5;
        const glowR = a.radius * (0.8 + pulse * 0.6);
        const ci = Math.floor(Math.abs(Math.sin(a.phase * 3)) * COLORS.length);
        const col = COLORS[ci % COLORS.length];

        const grad = ctx!.createRadialGradient(a.x, a.y, 0, a.x, a.y, glowR);
        grad.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${0.04 * pulse})`);
        grad.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(a.x - glowR, a.y - glowR, glowR * 2, glowR * 2);
      }

      // Update and draw particles
      for (const p of particles) {
        // Perlin-style flow field
        const angle = noise3d(
          p.x * noiseScale,
          p.y * noiseScale,
          time * 0.3 + p.noiseOffset
        ) * Math.PI * 4;

        const flowForce = pulseSpeed * 2;
        p.vx += Math.cos(angle) * flowForce * p.baseSpeed;
        p.vy += Math.sin(angle) * flowForce * p.baseSpeed;

        // Attractor forces
        for (const a of attractors) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) dist = 1;

          const pulse = Math.sin(time * a.freq + a.phase);
          let strength = attractorStrength * pulse / (dist * 0.05);
          const wavePhase = Math.sin(dist * 0.03 - time * a.freq);
          strength *= wavePhase;

          const perpX = -dy / dist;
          const perpY = dx / dist;

          p.vx += (dx / dist * strength + perpX * strength * p.orbitTendency) * 0.008;
          p.vy += (dy / dist * strength + perpY * strength * p.orbitTendency) * 0.008;
        }

        // Kick burst
        if (kickPulse > 0.8) {
          p.vx += (Math.random() - 0.5) * kickPulse * 0.4;
          p.vy += (Math.random() - 0.5) * kickPulse * 0.4;
        }

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 5) {
          p.vx = (p.vx / speed) * 5;
          p.vy = (p.vy / speed) * 5;
        }

        p.prevX = p.x;
        p.prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Wrap
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;

        // Respawn
        if (p.life <= 0) {
          Object.assign(p, spawnParticle());
        }

        // Draw
        const col = COLORS[p.colorIndex];
        const lifeFrac = p.life / p.maxLife;
        const lifeFade = lifeFrac > 0.9 ? (1 - lifeFrac) / 0.1 : lifeFrac < 0.1 ? lifeFrac / 0.1 : 1;
        const brightness = 80 + (speed / 4) * 175;
        const alpha = (brightness / 255) * lifeFade * 0.7;

        // Trail
        ctx!.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha * 0.6})`;
        ctx!.lineWidth = p.size * (0.7 + bassPulse * 0.5);
        ctx!.beginPath();
        ctx!.moveTo(p.prevX, p.prevY);
        ctx!.lineTo(p.x, p.y);
        ctx!.stroke();

        // Core
        const pSize = p.size * (1 + bassPulse * 0.4 + speed * 0.08);
        ctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, pSize * 0.5, 0, Math.PI * 2);
        ctx!.fill();

        // Bright core for fast particles
        if (speed > 2) {
          ctx!.fillStyle = `rgba(255,255,255,${alpha * 0.25})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, pSize * 0.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      animRef.current = requestAnimationFrame(frame);
    }

    // Initial fill
    ctx.fillStyle = "rgb(10, 10, 26)";
    ctx.fillRect(0, 0, w, h);
    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
