/**
 * Silky-Smooth Procedural Audio Engine (v6.5-luxury).
 * Designed for ultra-smooth, whisper-quiet electric motor glide.
 * Zero harsh buzzes, zero irritating beeps, zero voice speech.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public isMuted: boolean = false;
  public volume: number = 0.65;

  private motorOsc: OscillatorNode | null = null;
  private motorSubOsc: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private motorFilter: BiquadFilterNode | null = null;
  private isMoving: boolean = false;
  private lastMoveTime: number = 0;

  constructor() {
    // Lazy AudioContext initialization on first gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.85;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public unlock() {
    this.initContext();
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * Ultra-smooth, velvety whisper-quiet electric motor glide.
   * Uses filtered pure sine waves with deep low-pass 190Hz damping.
   * Completely non-irritating, silky smooth electric hum.
   */
  public playMove() {
    if (this.isMuted) return;
    if (!this.ctx || this.ctx.state !== "running" || !this.masterGain) return;

    const now = performance.now();
    // Throttle so sound glides continuously with smooth cadence
    if (now - this.lastMoveTime < 130) return;
    this.lastMoveTime = now;

    try {
      const t = this.ctx.currentTime;
      const dur = 0.22;

      // Deep acoustic low-pass filter to remove all harshness
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(190, t);
      filter.Q.setValueAtTime(0.7, t);

      // Primary silky electric motor glide (smooth gentle sine wave)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(72, t);
      osc.frequency.linearRampToValueAtTime(94, t + dur * 0.45);
      osc.frequency.linearRampToValueAtTime(68, t + dur);

      // Whisper-quiet gentle gain
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.018, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      // Warm sub-harmonic cushion (42 Hz)
      const sub = this.ctx.createOscillator();
      const subG = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(42, t);
      subG.gain.setValueAtTime(0.0001, t);
      subG.gain.linearRampToValueAtTime(0.014, t + 0.05);
      subG.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      sub.connect(subG);
      gain.connect(filter);
      subG.connect(filter);
      filter.connect(this.masterGain);

      osc.start(t);
      sub.start(t);
      osc.stop(t + dur);
      sub.stop(t + dur);
    } catch {}
  }

  /**
   * Goal arrival chime - silent or ultra-subtle soft harmonic
   */
  public playGoal() {
    // Only moving sound of robot is active per user preference
  }

  /**
   * Collision bump - silent per user preference
   */
  public playBonk() {
    // Intentionally silent
  }

  /**
   * UI tactile click - silent per user preference
   */
  public playClick() {
    // Intentionally silent
  }

  public playToolSelect() {
    // Intentionally silent
  }

  // Voice completely disabled per user preference
  public speak(_text: string) {
    // Intentionally silent - zero voice synthesis
  }

  /**
   * Render real-time live cyber oscilloscope waveform onto an HTML5 Canvas.
   */
  public renderOscilloscope(canvas: HTMLCanvasElement) {
    if (!this.analyser || !this.dataArray) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    (this.analyser as any).getByteTimeDomainData(this.dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1.8;
    ctx.strokeStyle = this.isMuted ? "rgba(100, 116, 139, 0.4)" : "#00f0ff";

    ctx.beginPath();
    const sliceWidth = canvas.width / this.dataArray.length;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2.0;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
}

export const sound = new SoundManager();
