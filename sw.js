const CACHE_NAME = "okinawa-trip-2026-v2";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./img/037ab104126f6843a4d1264f42926ab5_m.png",
  "./img/07ed34f46b856337cea843d294287933_m.png",
  "./img/130f21e980593ce7e537a81a804a1bc3_m.png",
  "./img/1a8c0a85ed3586e6076dac22272185d7_m.png",
  "./img/38ee8e633d933570a2506d1ceba9290b_m.png",
  "./img/5607d35bb32e267fd37f06948e578902_m.png",
  "./img/6ea8d929a518be32eb78754371390526_m.png",
  "./img/73c010eaa7438086463ffc02641320d9_m.png",
  "./img/ace6dd945ee55438d6cc274d7d64dce2_m.png",
  "./img/b084912808574bde91de683704e1503d_m.png",
  "./img/e3d0f526cfd0d3725b9814853efd7932_m.png",
  "./img/f845741c04f2845bd5ca99241c714706_m.png",
  "./img/manhole_logo_jp.png",
  "./img/apple-touch-icon.png",
  "./img/favicon-32.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return; // let cross-origin (CDN, map tiles) go straight to network
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
