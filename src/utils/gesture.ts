export interface FingerSample {
  x: number;
  y: number;
  time: number;
}

const HISTORY_SIZE = 6;
const MIN_SAMPLES = 3;
const VELOCITY_THRESHOLD = 1.5; // rad/s minimum to trigger spin

export class GestureTracker {
  private samples: FingerSample[] = [];
  private centerX = 0.5;
  private centerY = 0.5;

  setCenter(x: number, y: number) {
    this.centerX = x;
    this.centerY = y;
  }

  addSample(x: number, y: number, time: number) {
    this.samples.push({ x, y, time });
    if (this.samples.length > HISTORY_SIZE) {
      this.samples.shift();
    }
  }

  /**
   * Compute angular velocity (rad/s) of the finger around the screen center.
   * Positive = counter-clockwise, negative = clockwise.
   */
  getAngularVelocity(): number | null {
    if (this.samples.length < MIN_SAMPLES) return null;

    let totalAngularChange = 0;
    let totalTime = 0;

    for (let i = 1; i < this.samples.length; i++) {
      const prev = this.samples[i - 1];
      const curr = this.samples[i];

      const prevAngle = Math.atan2(
        prev.y - this.centerY,
        prev.x - this.centerX
      );
      const currAngle = Math.atan2(
        curr.y - this.centerY,
        curr.x - this.centerX
      );

      let delta = currAngle - prevAngle;
      // Normalize to [-PI, PI]
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      totalAngularChange += delta;
      totalTime += (curr.time - prev.time) / 1000; // ms → s
    }

    if (totalTime < 0.01) return null;

    const angularVelocity = totalAngularChange / totalTime;
    return Math.abs(angularVelocity) > VELOCITY_THRESHOLD
      ? angularVelocity
      : null;
  }

  clear() {
    this.samples = [];
  }
}
