/* Enhanced service worker for a static portfolio.
   Goals: faster repeat visits + basic offline resilience + stale-while-revalidate.
   No analytics, no logging. */

const CACHE_NAME = 'mm-portfolio-v2';
const STATIC_CACHE = 'mm-portfolio-static-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/privacy.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/profile.jpg',
  '/og-image.svg',
  '/robots.txt',
  '/sitemap.xml',
  '/.well-known/security.txt',
  '/chatbot/chatbot.css',
  '/chatbot/chatbot.js',
  '/chatbot/chatbot_knowledge.json',
  '/case-studies/ocr-document-automation.html',
  '/case-studies/rag-assistant.html'
];

// Static assets that rarely change
const STATIC_ASSETS = [
  '/favicon.svg',
  '/og-image.svg',
  '/profile.jpg',
  '/robots.txt',
  '/sitemap.xml',
  '/.well-known/security.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => {
          if (k === CACHE_NAME || k === STATIC_CACHE) return Promise.resolve();
          return caches.delete(k);
        })
      );
      await self.clients.claim();
    })()
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests.
  if (url.origin !== self.location.origin) return;

  // HTML: Stale-while-revalidate for faster perceived performance
  if (isHtmlRequest(req)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        
        // Start fetching fresh content in parallel
        const fetchPromise = fetch(req).then((fresh) => {
          if (fresh.ok) {
            cache.put(req, fresh.clone());
          }
          return fresh;
        }).catch(() => null);

        // Return cached version immediately if available, otherwise wait for network
        if (cached) {
          fetchPromise.catch(() => {}); // Don't wait for fetch to fail
          return cached;
        }

        // If no cache, wait for network with fallback
        const fresh = await fetchPromise;
        if (fresh) return fresh;
        
        // Final fallback
        return (await cache.match('/index.html')) || (await cache.match('/404.html'));
      })()
    );
    return;
  }

  // Static assets: Cache-first (they rarely change)
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          if (fresh.ok) {
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch (_) {
          return new Response('', { status: 504, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

  // Other assets: Stale-while-revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      
      // Start fetching fresh content
      const fetchPromise = fetch(req).then((fresh) => {
        if (fresh.ok) {
          cache.put(req, fresh.clone());
        }
        return fresh;
      }).catch(() => null);

      // Return cached immediately if available
      if (cached) {
        fetchPromise.catch(() => {}); // Don't wait for fetch
        return cached;
      }

      // Wait for network
      const fresh = await fetchPromise;
      if (fresh) return fresh;
      
      return new Response('', { status: 504, statusText: 'Offline' });
    })()
  );
});
