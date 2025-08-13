import { NetworkMonitorConfig, NetworkStatus, SlowConnectionTypes } from "./types.d";

interface NetworkInformation extends EventTarget {
  effectiveType?: SlowConnectionTypes;
  addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null) => void;
}

export class NetworkMonitor {
  private listeners: ((status: NetworkStatus) => void)[] = [];
  private currentStatus: NetworkStatus = {
    online: !!navigator?.onLine,
    latency: null,
    effectiveType: undefined,
    poorConnection: !navigator?.onLine,
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private config:NetworkMonitorConfig;

  constructor(private networkMonitorConfig?:NetworkMonitorConfig) {
    this.config = {
      // Ensuring default config merging.
      // To prevent overwrites of defaults of missing configurations to `undefined`
      pingUrl: this.networkMonitorConfig?.pingUrl || "/ping.txt",
      latencyThreshold: this.networkMonitorConfig?.latencyThreshold || 1800,
      slowConnectionTypes: this.networkMonitorConfig?.slowConnectionTypes || ['2g', 'slow-2g', '3g'],
      pingIntervalMs: this.networkMonitorConfig?.pingIntervalMs || 60000,
      fallbackPingIntervalMs: this.networkMonitorConfig?.fallbackPingIntervalMs || 10000
    }
    
    this.init();
  }

  /**
   * Get the network current status. This returns a snapshot of the current value
   */
  get status(): NetworkStatus {
    return this.currentStatus;
  }

  /**
   * Subscribe to network status updates and observe real-time changes
   */
  subscribe(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener);
    listener(this.currentStatus);
  }

  /**
   * Manually trigger a network status check. This accepts an optional callback which returns the new status
   */
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

    const connection = this.getConnection();
    const hasConnection = (!!connection && typeof connection?.addEventListener === 'function')
    if (hasConnection) {
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

    // Fallback Periodic connection checks
    // every one min if navigator connection is available
    // 10 seconds otherwise
    const interval = (hasConnection ? this.config?.pingIntervalMs : this.config?.fallbackPingIntervalMs) || 10000;
    this.refresh();
    this.intervalId = setInterval(() => this.refresh(), interval);
  }

  private async refresh(): Promise<NetworkStatus> {
    const start = performance.now();
    let online = navigator?.onLine;
    let latency: number | null = null;
    const connection = this.getConnection();
    let effectiveType: SlowConnectionTypes | undefined = connection?.effectiveType;

    try {
      await fetch(this.config.pingUrl || '/ping.txt', { headers: { "X-Heartbeat": "true" } });
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

  private isPoorConnection(effectiveType: SlowConnectionTypes | undefined, latency: number | null): boolean {
    return (
      !navigator?.onLine ||
      (effectiveType && this.config?.slowConnectionTypes?.includes(effectiveType)) ||
      (latency !== null && latency > (this.config?.latencyThreshold || 1800))
    );
  }
}