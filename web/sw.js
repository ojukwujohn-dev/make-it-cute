/* Make It Cute offline support. Bump VERSION whenever you upload a new index.html. */
const VERSION = "mic-v4";
const CORE = [
  "./", "index.html", "manifest.webmanifest", "qrcode.js", "fonts/fonts.css",
  "fonts/gochi-hand-latin-400-normal.woff2", "fonts/dm-serif-display-latin-400-normal.woff2",
  "fonts/quicksand-latin-500-normal.woff2", "fonts/quicksand-latin-600-normal.woff2", "fonts/quicksand-latin-700-normal.woff2",
  "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.includes("/videos/")) return;            // videos stream from the network
  if (req.mode === "navigate") {                               // pages: fresh when online, cached when offline
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
