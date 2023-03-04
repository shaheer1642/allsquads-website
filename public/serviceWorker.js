const CACHE_NAME = 'site-cache-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
self.addEventListener('activate', event => {
    // Remove old caches
    event.waitUntil(
        (async () => {
        const keys = await caches.keys();
        return keys.map(async (cache) => {
            if(cache !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache:',cache);
            return await caches.delete(cache);
            }
        })
        })()
    )
})