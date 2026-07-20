const CACHE_NAME = 'a4-editor-v2';

// 1. Incluimos la raíz del sitio y los dos íconos obligatorios
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación y guardado en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // Fuerza al Service Worker a activarse de inmediato sin esperar a cerrar la pestaña
  self.skipWaiting();
});

// Activación y limpieza
self.addEventListener('activate', (e) => {
  e.waitUntil(
    // Toma el control inmediato de todos los clientes/pestañas abiertas
    self.clients.claim()
  );
});

// Estrategia de respuesta (Caché primero, luego red)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
