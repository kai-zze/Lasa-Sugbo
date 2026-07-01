const CACHE_NAME = 'lasa-sugbo-v3';
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

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

// Helper function to add long cache headers to a response
function withCacheHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Apply cache-first with synthesized Cache-Control headers for all static assets
  if (url.origin === self.location.origin && 
      (url.pathname.includes('/fonts/') || 
       url.pathname.includes('/images/') || 
       url.pathname.includes('/css/') || 
       url.pathname.includes('/js/'))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return withCacheHeaders(cachedResponse);
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return withCacheHeaders(networkResponse);
        });
      })
    );
  } else {
    // Default Stale-While-Revalidate for other precached assets like index.html
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {});
        return cachedResponse || fetchPromise;
      })
    );
  }
});
