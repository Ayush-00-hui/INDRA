/**
 * Offline Replay Engine.
 * Plays pre-recorded simulation sessions directly in the browser with zero server dependencies.
 */

export interface ReplayPayload {
  version: number;
  id: string;
  scenario: string;
  mode: string;
  seed: number;
  frame_count: number;
  fps: number;
  frames: any[];
}

export class ReplayLoader {
  private frames: any[] = [];
  private frameIndex: number = 0;
  private isLoaded: boolean = false;
  private isPlaying: boolean = true;
  private timer: any = null;
  public onFrame: ((frame: any) => void) | null = null;
  public onLoaded: ((replay: ReplayPayload) => void) | null = null;
  public onError: ((err: any) => void) | null = null;

  public async load(scenario: string, variant: number, mode: string = "wm"): Promise<boolean> {
    this.stop();
    const modeKey = mode === "baseline" ? "baseline" : "wm";
    const filename = `${scenario}_s${variant}_${modeKey}.json`;
    const paths = [
      `./replays/${filename}`,
      `/replays/${filename}`,
      `web/replays/${filename}`
    ];

    let data: ReplayPayload | null = null;
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          data = await res.json();
          break;
        }
      } catch {
        continue;
      }
    }

    if (!data || !data.frames || data.frames.length === 0) {
      if (this.onError) this.onError(new Error(`Failed to load replay: ${filename}`));
      return false;
    }

    this.frames = data.frames;
    this.frameIndex = 0;
    this.isLoaded = true;
    if (this.onLoaded) this.onLoaded(data);
    this.play();
    return true;
  }

  public play(speed: number = 1.0) {
    this.isPlaying = true;
    if (this.timer) clearInterval(this.timer);
    const interval = Math.max(10, Math.round((1000 / 30) / speed));
    this.timer = setInterval(() => this.step(), interval);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public step() {
    if (!this.isLoaded || this.frames.length === 0) return;
    const frame = this.frames[this.frameIndex];
    if (this.onFrame) this.onFrame(frame);
    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
  }

  public stop() {
    this.pause();
    this.frameIndex = 0;
  }

  public getCurrentFrame(): any {
    return this.frames[this.frameIndex] || null;
  }
}
