const CACHE_NAME = 'calendar-ledger-cache-v1';
// These are the files that make up the "app shell".
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/Calendar.tsx',
  '/components/DayDetail.tsx',
  '/components/Header.tsx',
  '/components/MonthlyTotal.tsx',
  '/manifest.json'
];

// Install the service worker and cache the app shell.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache app shell:', error);
      })
  );
});

// Serve cached content when offline.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return it.
        if (response) {
          return response;
        }
        
        // If the request is not in the cache, fetch it from the network.
        return fetch(event.request).then(
          (networkResponse) => {
            // We don't cache responses from external CDNs in this simple example.
            return networkResponse;
          }
        );
      })
  );
});


// Clean up old caches.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
