const CACHE_NAME = 'postcalc-v3.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './icon-192.png',
    './manifest.json'
];

// 1. INSTALL EVENT: Download core assets to the device
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the new service worker to activate immediately, skipping the waiting lifecycle
    self.skipWaiting();
});

// 2. ACTIVATE EVENT: Annihilate old cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Instantly take control of all open browser tabs
    self.clients.claim();
});

// 3. FETCH EVENT: "Network First, Fallback to Cache" Strategy
self.addEventListener('fetch', (event) => {
    // Ignore non-GET requests and external CDNs (like html2canvas/jspdf)
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If network fetch is successful, dynamically update the cache with the fresh file
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // If the user is offline or network fails, serve the app from the local cache
                console.log('[Service Worker] Network fetch failed, serving from offline cache:', event.request.url);
                return caches.match(event.request);
            })
    );
});
