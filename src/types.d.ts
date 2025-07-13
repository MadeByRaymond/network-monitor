export interface NetworkStatus {
  online: boolean;
  latency: number | null;
  effectiveType?: string;
  poorConnection: boolean;
}

export interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null) => void;
}
