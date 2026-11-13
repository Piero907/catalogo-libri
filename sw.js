/* Catalogo libri: funziona anche senza rete. Le ricerche (Google Libri, Open Library) passano sempre dalla rete. */
const CACHE = 'catalogo-libri-v15';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'lib.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'vendor/zxing.min.js', 'vendor/tesseract.min.js', 'vendor/worker.min.js'];

self.addEventListener('install', (e) => {
  // un file mancante non deve impedire al service worker di partire (addAll fallirebbe per intero)
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit && url.pathname.includes('/vendor/')) return hit;   // componenti pesanti: prima la copia salvata
    try {
      const res = await fetch(req);
      if (res.ok && res.status === 200) { cache.put(req, res.clone()); return res; }
      // il sito risponde con un errore (pausa, 401, 503...): meglio la copia salvata sul telefono
      if (hit) return hit;
      if (req.mode === 'navigate') { const idx = await cache.match('index.html'); if (idx) return idx; }
      return res;
    } catch (err) {
      if (hit) return hit;
      if (req.mode === 'navigate') { const idx = await cache.match('index.html'); if (idx) return idx; }
      throw err;
    }
  })());
});
