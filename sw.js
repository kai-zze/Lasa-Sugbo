const CACHE_NAME = 'lasa-sugbo-v2';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.min.css',
  './js/script.js',
  './fonts/fraunces.woff2',
  './fonts/spacemono-regular.woff2',
  './fonts/spacemono-bold.woff2',
  './fonts/worksans.woff2'
];

// On install, precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Cache first strategy for fonts and images, stale-while-revalidate for others
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if it's a local asset in fonts/ or images/
  if (url.origin === self.location.origin && (url.pathname.includes('/fonts/') || url.pathname.includes('/images/'))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Default Stale-While-Revalidate for other precached assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {
          // Ignore offline fetch errors if we have cache
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
