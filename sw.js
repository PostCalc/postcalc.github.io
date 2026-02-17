// ✅ Version v19 (Maximum Resilience PWA Strategy)
const CACHE_NAME = "postcalc-cache-v19";

// 1. Critical assets needed for instant offline load
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// 2. External CDN assets (Google Fonts & Image Export)
const CDN_URLS = [
  "cdnjs.cloudflare.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com"
];

// ✅ Install Event: Aggressive Pre-caching
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all vital assets");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// ✅ Activate Event: Aggressive Clean-up of Old Versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// ✅ Fetch Event: Advanced Multi-Strategy Routing
self.addEventListener("fetch", (event) => {
  // Only handle GET requests (Ignore POST, etc.)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;
  const isCDN = CDN_URLS.some(domain => url.hostname.includes(domain));

  // STRATEGY 1: HTML Navigation (Network First, fallback to Cache)
  // Ensures you always get the latest app version if online, but works perfectly if offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          console.log("[Service Worker] Offline! Serving cached index.html");
          return caches.match("./index.html");
        })
    );
    return; // Exit fetch handler for navigation requests
  }

  // STRATEGY 2: Assets & CDNs (Stale-While-Revalidate)
  // Instant loading from cache for CSS/JS/Images, while secretly checking for updates in the background.
  if (isLocal || isCDN) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid responses (Status 200 or Status 0 for opaque CDN responses)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Silent catch to prevent red console errors when completely offline
          });

        // Serve the cache instantly if it exists. If not, wait for the network.
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// ✅ Message Event: Force Immediate Update
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
