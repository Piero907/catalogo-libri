/*
 * Intermediario per il catalogo SBN (opac.sbn.it) usato da «Catalogo libri».
 *
 * Il catalogo delle biblioteche italiane non si lascia interrogare direttamente da una pagina web
 * (il browser lo blocca). Questo piccolo programma gira gratis su Cloudflare Workers: riceve l'ISBN
 * dall'app, chiede i dati a SBN (ricerca + scheda completa) e li rimanda all'app.
 *
 * Come si installa: vedi LEGGIMI.txt, sezione «CATALOGO SBN».
 * Se pubblichi l'app a un indirizzo diverso, aggiungilo in ORIGINI_AMMESSE.
 */
const ORIGINI_AMMESSE = ['https://piero907.github.io'];
const SBN = 'https://opac.sbn.it/opacmobilegw/';

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ORIGINI_AMMESSE.includes(origin) ? origin : ORIGINI_AMMESSE[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return risposta({ error: 'solo GET' }, 405, cors);
    // dal browser, solo l'app (le prove a mano, senza Origin, sono ammesse)
    if (origin && !ORIGINI_AMMESSE.includes(origin)) return risposta({ error: 'origine non ammessa: ' + origin }, 403, cors);

    const isbn = (new URL(request.url).searchParams.get('isbn') || '').replace(/[^0-9Xx]/g, '').toUpperCase();
    if (!/^(97[89]\d{10}|\d{9}[\dX])$/.test(isbn)) return risposta({ error: 'ISBN mancante o non valido' }, 400, cors);

    const opzioni = { headers: { 'Accept': 'application/json', 'User-Agent': 'CatalogoLibri/1.0 (uso personale)' }, cf: { cacheTtl: 86400, cacheEverything: true } };
    let dati;
    try {
      const r = await fetch(SBN + 'search.json?isbn=' + isbn, opzioni);
      if (!r.ok) return risposta({ error: 'SBN ha risposto con errore ' + r.status }, 502, cors);
      dati = await r.json();
    } catch (e) {
      return risposta({ error: 'SBN non raggiungibile' }, 502, cors);
    }
    // scheda completa del primo risultato: pagine, collana, classificazione Dewey
    const primo = Array.isArray(dati.briefRecords) ? dati.briefRecords[0] : null;
    if (primo && primo.codiceIdentificativo) {
      try {
        const f = await fetch(SBN + 'full.json?bid=' + encodeURIComponent(primo.codiceIdentificativo), opzioni);
        if (f.ok) dati.full = await f.json();
      } catch (e) { /* la scheda completa e' un di piu' */ }
    }
    return risposta(dati, 200, cors);
  }
};

function risposta(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': status === 200 ? 'public, max-age=86400' : 'no-store' }, cors)
  });
}
