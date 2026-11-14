/* Next Libris: funziona anche senza rete. Le ricerche (Google Libri, Open Library) passano sempre dalla rete. */
const CACHE = 'catalogo-libri-v52';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'lib.js', 'manifest.json',
  'icons/next-libris-192.png', 'icons/next-libris-512.png', 'vendor/zxing.min.js', 'vendor/fonts/literata-latin.woff2', 'vendor/tesseract.min.js', 'vendor/worker.min.js'];

self.addEventListener('install', (e) => {
  // un file mancante non deve impedire al service worker di partire (addAll fallirebbe per intero)
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
let slowUntil = 0;
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json')) return;            // il controllo della versione va sempre in rete, senza copie
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit && url.pathname.includes('/vendor/')) return hit;   // componenti pesanti: prima la copia salvata
    try {
      // rete lenta: se ho gia' la copia sul telefono, dopo 2,5 s parto da quella (la rete intanto aggiorna la copia)
      const net = fetch(req).then((res) => { if (res.ok && res.status === 200) cache.put(req, res.clone()); return res; });
      const shell = hit || (req.mode === 'navigate' ? await cache.match('index.html') : null);
      if (shell) {
        // pagina appena partita dalla copia: anche stile e codice dalla copia, subito (stessa versione)
        if (Date.now() < slowUntil && req.mode !== 'navigate') { net.catch(() => {}); return shell; }
        const quick = await Promise.race([net.catch(() => null), new Promise((r) => setTimeout(() => r('lenta'), 2500))]);
        if (quick === 'lenta') { if (req.mode === 'navigate') slowUntil = Date.now() + 15000; net.catch(() => {}); return shell; }
        if (quick && quick.ok && quick.status === 200) return quick;
        return shell;
      }
      const res = await net;
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
