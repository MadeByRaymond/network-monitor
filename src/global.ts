import { NetworkMonitor } from './index';

if (typeof window !== 'undefined') {
  (window as any).NetworkMonitor = NetworkMonitor;
}