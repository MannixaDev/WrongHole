/* WrongHole service worker — lets the app shell load on-course with no
   signal. Same-origin requests are served stale-while-revalidate: instant
   from cache, refreshed in the background for the next visit. Cross-origin
   requests (Google Maps, Overpass, Open-Meteo, Nominatim) are not
   intercepted — map tiles and live data need the network anyway. */
const CACHE = 'wronghole-v1';
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icon.svg', 'courses.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(request, { ignoreSearch: true });
      const network = fetch(request).then(response => {
        if(response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
