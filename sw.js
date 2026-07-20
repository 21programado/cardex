const CACHE_NAME = 'a4-editor-v4';

// Rutas sin el './' para evitar problemas de resolución de rutas en Vercel
const ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Instalación: Guarda los recursos clave en la caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Activa el nuevo Service Worker de inmediato sin esperar a cerrar la pestaña
  self.skipWaiting();
});

// Activación: Toma el control y limpia cachés antiguas si cambias la versión
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Toma el control inmediato de todas las ventanas/pestañas abiertas
      return self.clients.claim();
    })
  );
});

// Estrategia de respuesta: Intenta servir desde la caché, si no, busca en la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
