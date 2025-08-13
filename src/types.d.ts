type EffectiveNetworkTypes = '2g' | 'slow-2g' | '3g' | '4g';

export type SlowConnectionTypes = EffectiveNetworkTypes;

export interface NetworkStatus {
  online: boolean;
  latency: number | null;
  effectiveType?: EffectiveNetworkTypes;
  poorConnection: boolean;
}

/**
 * Configuration options for NetworkMonitorService
 */
export interface NetworkMonitorConfig {
  /**
   * The URL to ping when checking connectivity.
   * This should point to a small, cacheable file (e.g., a text file or url endpoint).
   * You can customize the ping URL to a different static file, endpoint or url.
   * 
   * Default: `/ping.txt`
   */
  pingUrl?: string;

  /**
   * The latency threshold (in milliseconds) above which
   * the connection is considered "slow".
   * 
   * Default: `1800` ms
   */
  latencyThreshold?: number;

  /**
   * List of `effectiveType` values that should be treated
   * as slow connections. Common values: `'2g'`, `'slow-2g'`, `'3g'`, `'4g'`.
   * 
   * Default: `['2g', 'slow-2g', '3g']`
   */
  slowConnectionTypes?: SlowConnectionTypes[];

  /**
   * Default ping interval (in milliseconds) when the
   * browser supports [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API).
   * 
   * Default: `60000` (60 seconds)
   */
  pingIntervalMs?: number;

  /**
   * Default ping interval (in milliseconds) when the
   * browser does `NOT` support [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). 
   * As a result, this should ping much more frequently than `pingIntervalMs`.
   * 
   * Many browsers E.g: Firefox, Safari, IE, etc and 
   * devices E.g: macOS, iOS, etc, will fallback to this as 
   * Network Information API is typically not supported on them. 
   * 
   * Default: `10000` (10 seconds)
   */
  fallbackPingIntervalMs?: number;
}
