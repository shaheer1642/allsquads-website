const CACHE_NAME = 'site-cache-v1.5';
const toCache = [
    '/',
    '/index.html',
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
    const cache = await caches.open(CACHE_NAME)
    const cacheMatch = await cache.match(event.request)

    if (navigator.onLine) {
      const request = fetch(event.request)

      event.waitUntil(async function() {
        const response = await request
        await cache.put(event.request, await response.clone())
      }())

      return cacheMatch || request
    }

    return cacheMatch
  }())
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})