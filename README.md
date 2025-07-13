# network-monitor-js

> 🛰️ A lightweight JS utility to monitor internet connectivity, online/offline, connection quality (2G/3G/4G/5G), ping latency and detect poor network conditions.

[![npm](https://img.shields.io/npm/v/network-monitor-js.svg)](https://www.npmjs.com/package/network-monitor-js)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/MadeByRaymond/network-monitor)
![License](https://img.shields.io/npm/l/network-monitor-js)
<!-- ![NPM Downloads](https://img.shields.io/npm/d18m/network-monitor-js) -->

---

## ✨ Features

- ✅ Detects online/offline status
- ⏱️ Measures latency via periodic ping
- 📶 Tracks network type (e.g. `5g`, `4g`, `3g`, `slow-2g`)
- ⚠️ Flags poor network connections
- 🔁 Emits changes when network status updates
- 🪶 No dependencies, small footprint (~1KB gzipped)

---

## 📦 Install

### NPM
```bash
npm install network-monitor-js
```

### CDN
```html
<script src="https://unpkg.com/network-monitor-js"></script>
<script>
  const monitor = new NetworkMonitor();
  monitor.subscribe(status => console.log(status));
</script>
```

---

## 📚 Usage

```ts
import { NetworkMonitor } from 'network-monitor-js';

const monitor = new NetworkMonitor('/ping.txt');
monitor.subscribe(status => {
  console.log('Online:', status.online);
  console.log('Latency:', status.latency);
  console.log('Effective Type:', status.effectiveType);
  console.log('Poor Connection:', status.poorConnection);
});
```

---

## 🛠 API

### `new NetworkMonitor(pingUrl?: string)`
- `pingUrl`: (optional) URL to a lightweight file (default: `/ping.txt`). 
- You can customize the ping URL to a different static file, endpoint or url

### `subscribe(callback: (status: NetworkStatus) => void)`
- Subscribes to real-time status updates

### `runManualCheck(callback?: (status: NetworkStatus) => void)`
- Manually trigger a ping + status refresh and accepts an optional callback which returns the new status

### `status: NetworkStatus`
- Returns the current status snapshot

---

## 📁 Assets (for default setup)
Ensure this file exists in your app as a static file if using the default ping path:
```
/ping.txt
```
If you prefer to ping a different static file / endpoint / url, you can change the default value as mentioned in the "📚 Usage" section:
```ts
const monitor = new NetworkMonitor('/your-api/ping');
```

---
## 🧠 Example UI

```html
<div id="status-box"></div>

<script>
  const monitor = new NetworkMonitor();

  monitor.subscribe(status => {
    document.getElementById('status-box').innerHTML = `
      <p>✅ Online: ${status.online}</p>
      <p>⏱️ Latency: ${status.latency ?? 'N/A'}ms</p>
      <p>📶 Type: ${status.effectiveType ?? 'unknown'}</p>
      <p>⚠️ Poor Connection: ${status.poorConnection}</p>
    `;
  });
</script>
```

---

## 🧪 Development

```bash
# Run tests
npm run test
```

---

## 🔒 License

Apache-2.0 © MadeByRaymond (Daniel Obiekwe)

---

## ❤️ Support

If you find this package helpful, you can support our projects here:

[![Buy Me a Smoothie](https://img.buymeacoffee.com/button-api/?text=Buy%20Me%20a%20Smoothie&emoji=🍹&slug=MadeByRaymond&button_colour=FFDD00&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/MadeByRaymond)
