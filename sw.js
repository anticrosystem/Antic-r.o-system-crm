const CACHE = 'antic-ro-crm-v22.74';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './antic-ro-system-192.png',
  './antic-ro-system-512.png',
  './icon-192.png',
  './icon-512.png',
  './authorized-signature-clean.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache each existing local asset independently so one optional asset
    // cannot prevent the entire service worker from installing.
    await Promise.all(ASSETS.map(async asset => {
      try {
        const response = await fetch(asset, { cache: 'reload' });
        if (response && response.ok) await cache.put(asset, response);
      } catch (error) {
        // A missing/offline optional asset should not break installation.
        console.warn('Antic CRM: asset not cached:', asset, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('antic-ro-crm-') && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match('./index.html');
        if (cached) return cached;
        return new Response(
          '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Antic CRM offline</title><body style="font-family:Arial;padding:24px"><h2>Antic R.O System CRM</h2><p>You are offline and no saved app page is available yet. Reconnect to the internet and open the CRM once, then try again.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
        );
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      return await fetch(request);
    } catch (error) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
