const CACHE_NAME = 'site-cache-v1.2';
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

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyAxDsMVypgqkrY31cJici7P-KsISDkb5-Y",
    authDomain: "gaussprime-2e46e.firebaseapp.com",
    projectId: "gaussprime-2e46e",
    storageBucket: "gaussprime-2e46e.appspot.com",
    messagingSenderId: "527087624830",
    appId: "1:527087624830:web:117b4bb3f5de6de5ad6e2f",
    measurementId: "G-WFL1P9NTJX"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});