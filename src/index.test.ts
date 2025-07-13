import { describe, expect, it } from 'vitest';
import { NetworkMonitor } from '../src/index';

describe('NetworkMonitor', () => {
  it('should create an instance', () => {
    const monitor = new NetworkMonitor();
    expect(monitor).toBeInstanceOf(NetworkMonitor);
  });

  it('should have a status object', () => {
    const monitor = new NetworkMonitor();
    expect(monitor.status).toHaveProperty('online');
  });
});
