import { NetworkInformation, NetworkStatus as NS } from "./types";

export type NetworkStatus = NS;

export class NetworkMonitor {
  private listeners: ((status: NetworkStatus) => void)[] = [];
  private currentStatus: NetworkStatus = {
    online: !!navigator?.onLine,
    latency: null,
    effectiveType: undefined,
    poorConnection: !navigator?.onLine,
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private slowNetworkType = ["3g", "2g", "slow-2g"];

  constructor(private pingUrl = "/ping.txt") {
    this.init();
  }

  get status(): NetworkStatus {
    return this.currentStatus;
  }

  subscribe(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener);
    listener(this.currentStatus);
  }

  runManualCheck(callback?: (status: NetworkStatus) => void) {
    this.refresh().then(callback);
  }

  private emit(status: NetworkStatus) {
    const prev = JSON.stringify(this.currentStatus);
    const next = JSON.stringify(status);
    if (prev !== next) {
      this.currentStatus = status;
      for (const l of this.listeners) l(status);
    }
  }

  private init() {
    window.addEventListener("online", () => this.refresh());
    window.addEventListener("offline", () => this.refresh());
    
    this.initConnectionChangeListener();

    const connection = this.getConnection();
    const interval = connection ? 60000 : 10000;
    this.refresh();
    this.intervalId = setInterval(() => this.refresh(), interval);
  }

  private initConnectionChangeListener() {
    const connection = this.getConnection();
    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener("change", () => {
        const effectiveType = connection.effectiveType;
        const poorConnection = this.isPoorConnection(effectiveType, this.currentStatus.latency);
        this.emit({
          ...this.currentStatus,
          effectiveType,
          poorConnection
        });
      });
    }
  }

  private async refresh(): Promise<NetworkStatus> {
    const start = performance.now();
    let online = navigator?.onLine;
    let latency: number | null = null;
    const connection = this.getConnection();
    let effectiveType: string | undefined = connection?.effectiveType;

    try {
      await fetch(this.pingUrl, { headers: { "X-Heartbeat": "true" } });
      latency = performance.now() - start;
      online = true;
    } catch {
      online = false;
    }

    const poorConnection = this.isPoorConnection(effectiveType, latency);

    const status: NetworkStatus = {
      online,
      latency,
      effectiveType,
      poorConnection,
    };

    this.emit(status);
    return status;
  }

  private getConnection(): NetworkInformation | undefined {
    return typeof navigator !== 'undefined'
      ? (navigator as any).connection ||
          (navigator as any).mozConnection ||
          (navigator as any).webkitConnection
      : undefined;
  }

  private isPoorConnection(effectiveType: string | undefined, latency: number | null): boolean {
    return (
      !navigator?.onLine ||
      (effectiveType && this.slowNetworkType.includes(effectiveType)) ||
      (latency !== null && latency > 1000)
    );
  }
}