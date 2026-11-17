/**
 * WebSocket Simulation Client with Clock Sync & Jitter Tracking.
 * Connects to FastAPI backend, streams RenderState packets, and maintains
 * client-server clock synchronization for adaptive jitter buffering.
 * Automatically falls back to ReplayLoader if connection drops.
 */

export interface NetworkStats {
  latencyMs: number;
  clockOffsetMs: number;
  jitterMs: number;
  isConnected: boolean;
}

export class SimWSClient {
  private ws: WebSocket | null = null;
  private scenario: string;
  private reconnectAttempts: number = 0;
  private maxReconnects: number = 5;
  private isConnected: boolean = false;
  private shouldReconnect: boolean = true;

  // Clock sync & network telemetry
  public latencyMs: number = 1.0;
  public clockOffsetMs: number = 0.0;
  public jitterMs: number = 1.0;
  private lastPacketArrival: number = 0;
  private pingIntervalId: number | null = null;

  public onFrame: ((data: any) => void) | null = null;
  public onStatusChange: ((status: "connected" | "connecting" | "fallback_replay" | "disconnected") => void) | null = null;
  public onFallback: (() => void) | null = null;

  constructor(scenario: string) {
    this.scenario = scenario;
  }

  public connect() {
    this.shouldReconnect = true;
    if (this.onStatusChange) this.onStatusChange("connecting");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host || "127.0.0.1:8000";
    const url = `${protocol}//${host}/ws/${this.scenario}`;

    try {
      this.ws = new WebSocket(url);
    } catch (err) {
      this.handleConnectionFailure();
      return;
    }

    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (this.onStatusChange) this.onStatusChange("connected");
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const now = performance.now();
      try {
        const data = JSON.parse(event.data);

        // Handle pong message for clock synchronization
        if (data && data.type === "pong") {
          const rtt = Math.max(0.1, now - (data.client_t || now));
          this.latencyMs = rtt / 2.0;
          if (data.server_t) {
            this.clockOffsetMs = data.server_t - (Date.now() - this.latencyMs);
          }
          return;
        }

        // Measure packet arrival interval jitter
        if (this.lastPacketArrival > 0) {
          const interval = now - this.lastPacketArrival;
          const expected = 100.0; // ~10 Hz nominal
          const diff = Math.abs(interval - expected);
          this.jitterMs = this.jitterMs * 0.9 + diff * 0.1;
        }
        this.lastPacketArrival = now;

        if (this.onFrame) this.onFrame(data);
      } catch (e) {
        console.warn("WS packet parse error:", e);
      }
    };

    this.ws.onerror = () => {
      // Handled in onclose
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.isConnected = false;
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnects) {
        this.reconnectAttempts++;
        const backoffMs = Math.min(5000, 1000 * Math.pow(1.5, this.reconnectAttempts - 1));
        setTimeout(() => this.connect(), backoffMs);
      } else {
        this.handleConnectionFailure();
      }
    };
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.sendPing();
    this.pingIntervalId = window.setInterval(() => {
      this.sendPing();
    }, 2000);
  }

  private stopHeartbeat() {
    if (this.pingIntervalId !== null) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  private sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ cmd: "ping", t: performance.now() }));
      } catch (e) {}
    }
  }

  private handleConnectionFailure() {
    this.isConnected = false;
    this.stopHeartbeat();
    if (this.onStatusChange) this.onStatusChange("fallback_replay");
    if (this.onFallback) this.onFallback();
  }

  public sendCommand(cmd: Record<string, any>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(cmd));
    }
  }

  public getNetworkStats(): NetworkStats {
    return {
      latencyMs: Math.round(this.latencyMs * 10) / 10,
      clockOffsetMs: Math.round(this.clockOffsetMs * 10) / 10,
      jitterMs: Math.round(this.jitterMs * 10) / 10,
      isConnected: this.isConnected,
    };
  }

  public disconnect() {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}
