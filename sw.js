/* Next Libris: funziona anche senza rete. Le ricerche (Google Libri, Open Library) passano sempre dalla rete. */
const CACHE = 'catalogo-libri-v70';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'lib.js', 'manifest.json',
  'icons/next-libris-192.png', 'icons/next-libris-512.png', 'vendor/zxing.min.js', 'vendor/fonts/literata-latin.woff2', 'vendor/tesseract.min.js', 'vendor/worker.min.js'];

self.addEventListener('install', (e) => {
  // un file mancante non deve impedire al service worker di partire (addAll fallirebbe per intero)
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));   // anche la «prossima» di un service worker vecchio
});
/* Avvio immediato: la pagina e i suoi file partono dalla copia sul telefono (stessa versione, niente attese di rete);
   intanto, in sottofondo, scarico la versione nuova di tutti i file e la salvo solo se arrivano tutti (mai versioni mescolate).
   Le richieste «ricarica» (Aggiorna adesso) vanno sempre in rete. */
const SHELL_PATHS = new Set(SHELL.map((u) => new URL(u, self.registration.scope).pathname));
let lastRefresh = 0;
const NEXT = CACHE + '-prossima';
async function promoteNext(cache) {
  try {
    const next = await caches.open(NEXT);
    if (!(await next.match('__pronta'))) return;
    const keys = (await next.keys()).filter((k) => !k.url.endsWith('/__pronta'));
    await Promise.all(keys.map(async (k) => cache.put(k, await next.match(k))));
    await caches.delete(NEXT);
  } catch (e) {}
}
async function refreshShell() {
  if (Date.now() - lastRefresh < 60000) return;
  lastRefresh = Date.now();
  try {
    const got = await Promise.all(SHELL.map((u) => fetch(u, { cache: 'no-cache' }).then((r) => (r.ok && r.status === 200 ? r : null), () => null)));
    if (got.some((r) => !r)) return;                       // rete assente o un file mancante: tengo la versione che ho
    // la preparo a parte: prende il posto della copia in uso solo alla prossima apertura (la pagina aperta resta coerente)
    await caches.delete(NEXT);
    const next = await caches.open(NEXT);
    await Promise.all(got.map((r, i) => next.put(SHELL[i], r)));
    await next.put('__pronta', new Response('1'));
  } catch (e) {}
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json')) return;            // il controllo della versione va sempre in rete, senza copie
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const fresh = req.mode !== 'navigate' && (req.cache === 'reload' || req.cache === 'no-cache' || req.cache === 'no-store');   // l'apertura della pagina parte sempre dalla copia
    if (fresh) await caches.delete(NEXT);                    // «Aggiorna adesso»: vale la rete, non una copia preparata prima
    if (!fresh) {
      const nav = req.mode === 'navigate';
      if (nav) await promoteNext(cache);
      const hit = (await cache.match(req, { ignoreSearch: nav })) || (nav ? await cache.match('index.html') : null);
      if (hit) {
        if (nav) e.waitUntil(refreshShell());
        return hit;
      }
    }
    try {
      const res = await fetch(req);
      if (res.ok && res.status === 200 && (fresh || SHELL_PATHS.has(url.pathname) || url.pathname.includes('/vendor/') || url.pathname.includes('/icons/'))) cache.put(req, res.clone());
      if (!res.ok && req.mode === 'navigate') { const idx = await cache.match('index.html'); if (idx) return idx; }
      return res;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
      if (hit) return hit;
      if (req.mode === 'navigate') { const idx = await cache.match('index.html'); if (idx) return idx; }
      throw err;
    }
  })());
});
