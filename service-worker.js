const CACHE_NAME = 'klinik-majalaya-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/absensi_majalaya.html',
  '/admin_majalaya.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install: simpan file ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Langsung aktif tanpa tunggu tab lama ditutup
  self.skipWaiting();
});

// Activate: hapus cache lama otomatis
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Ambil alih semua tab yang aktif sekarang
  self.clients.claim();
});

// Fetch: network first, fallback ke cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
