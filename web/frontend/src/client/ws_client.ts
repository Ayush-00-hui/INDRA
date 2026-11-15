/**
 * WebSocket Simulation Client.
 * Connects to FastAPI backend and streams RenderState packets.
 * Automatically falls back to ReplayLoader if connection cannot be established.
 */

export class SimWSClient {
  private ws: WebSocket | null = null;
  private scenario: string;
  private reconnectAttempts: number = 0;
  private maxReconnects: number = 2;
  private isConnected: boolean = false;
  private shouldReconnect: boolean = true;

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
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onFrame) this.onFrame(data);
      } catch (e) {
        console.warn("WS packet parse error:", e);
      }
    };

    this.ws.onerror = () => {
      // Handled in onclose
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnects) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
      } else {
        this.handleConnectionFailure();
      }
    };
  }

  private handleConnectionFailure() {
    this.isConnected = false;
    if (this.onStatusChange) this.onStatusChange("fallback_replay");
    if (this.onFallback) this.onFallback();
  }

  public sendCommand(cmd: Record<string, any>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(cmd));
    }
  }

  public disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}
