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
        this.initMotorSynth();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private initMotorSynth() {
    if (!this.ctx || !this.masterGain || this.motorOsc) return;
    try {
      this.motorFilter = this.ctx.createBiquadFilter();
      this.motorFilter.type = "lowpass";
      this.motorFilter.frequency.setValueAtTime(190, this.ctx.currentTime);
      this.motorFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.motorGain = this.ctx.createGain();
      this.motorGain.gain.setValueAtTime(0.00001, this.ctx.currentTime);

      this.motorOsc = this.ctx.createOscillator();
      this.motorOsc.type = "sine";
      this.motorOsc.frequency.setValueAtTime(74, this.ctx.currentTime);

      this.motorSubOsc = this.ctx.createOscillator();
      this.motorSubOsc.type = "sine";
      this.motorSubOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

      this.motorOsc.connect(this.motorGain);
      this.motorSubOsc.connect(this.motorGain);
      this.motorGain.connect(this.motorFilter);
      this.motorFilter.connect(this.masterGain);

      this.motorOsc.start();
      this.motorSubOsc.start();
    } catch {}
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
   * Persistent zero-allocation continuous synthesizer.
   * Eliminates GC stutter and audio node thrashing.
   */
  public playMove() {
    if (this.isMuted) return;
    if (!this.ctx || this.ctx.state !== "running" || !this.masterGain) return;
    if (!this.motorOsc) this.initMotorSynth();

    const now = performance.now();
    this.lastMoveTime = now;

    if (this.motorGain && this.ctx) {
      const t = this.ctx.currentTime;
      const targetGain = this.isMuted ? 0 : 0.024 * this.volume;
      // Rapid smooth fade-in without pop
      this.motorGain.gain.setTargetAtTime(targetGain, t, 0.04);
      // Gentle exponential decay to silence if no further move calls arrive
      this.motorGain.gain.setTargetAtTime(0.00001, t + 0.12, 0.09);
    }
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
