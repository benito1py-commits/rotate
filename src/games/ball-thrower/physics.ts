interface VelocitySample {
  x: number;
  y: number;
  time: number;
}

const MAX_SAMPLES = 8;

export class VelocityTracker {
  private samples: VelocitySample[] = [];

  addSample(x: number, y: number, time: number) {
    this.samples.push({ x, y, time });
    if (this.samples.length > MAX_SAMPLES) {
      this.samples.shift();
    }
  }

  getVelocity(): { vx: number; vy: number } {
    if (this.samples.length < 2) return { vx: 0, vy: 0 };

    // Average velocity from recent samples
    let totalVx = 0;
    let totalVy = 0;
    let count = 0;

    for (let i = 1; i < this.samples.length; i++) {
      const prev = this.samples[i - 1];
      const curr = this.samples[i];
      const dt = (curr.time - prev.time) / 1000;
      if (dt < 0.001) continue;

      totalVx += (curr.x - prev.x) / dt;
      totalVy += (curr.y - prev.y) / dt;
      count++;
    }

    if (count === 0) return { vx: 0, vy: 0 };

    return {
      vx: totalVx / count,
      vy: totalVy / count,
    };
  }

  clear() {
    this.samples = [];
  }
}

export const PINCH_THRESHOLD = 0.06;

export function getPinchDistance(
  thumb: { x: number; y: number },
  index: { x: number; y: number }
): number {
  const dx = thumb.x - index.x;
  const dy = thumb.y - index.y;
  return Math.sqrt(dx * dx + dy * dy);
}
