/* Logica pura del catalogo: ISBN, ricerca nelle banche dati, lettura della copertina, export.
   Nessun accesso al DOM, così si può provare da riga di comando. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Lib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- testo e numeri ---------- */
  function str(v) { return typeof v === 'string' ? v : (typeof v === 'number' && isFinite(v) ? String(v) : ''); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function parseNum(s) {
    s = String(s == null ? '' : s).replace(/[^\d,.\-]/g, '');
    if (!s) return null;
    if (s.indexOf(',') >= 0 && s.indexOf('.') >= 0) {
      s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    } else {
      s = s.replace(',', '.');
    }
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }
  function fmtNum(n) { return n.toFixed(2).replace('.', ','); }
  function sortKeyTitle(t) { return norm(t).replace(/^(?:(?:il|lo|la|i|gli|le|un|uno|una|the|a|an)\s+|l['’]\s*)/, '').trim(); }
  function sortKeyAuthor(a) {
    var first = String(a || '').split(',')[0].trim();
    var parts = first.split(/\s+/);
    return norm(parts[parts.length - 1] || '') + ' ' + norm(first);
  }
  function yearOf(s) { var m = String(s || '').match(/\b(1[4-9]\d\d|20\d\d)\b/); return m ? m[1] : ''; }

  /* ---------- ISBN ---------- */
  function isbnClean(s) { return String(s || '').replace(/[^0-9Xx]/g, '').toUpperCase(); }
  function isbn13Valid(s) {
    if (!/^97[89]\d{10}$/.test(s)) return false;
    var sum = 0;
    for (var i = 0; i < 12; i++) sum += (+s[i]) * (i % 2 ? 3 : 1);
    return (10 - sum % 10) % 10 === +s[12];
  }
  function isbn10Valid(s) {
    if (!/^\d{9}[\dX]$/.test(s)) return false;
    var t = 0;
    for (var j = 0; j < 9; j++) t += (+s[j]) * (10 - j);
    t += s[9] === 'X' ? 10 : +s[9];
    return t % 11 === 0;
  }
  function isbn10to13(s) {
    var core = '978' + s.slice(0, 9), sum = 0;
    for (var i = 0; i < 12; i++) sum += (+core[i]) * (i % 2 ? 3 : 1);
    return core + ((10 - sum % 10) % 10);
  }
  function isbn13to10(s) {
    if (!/^978\d{10}$/.test(s)) return '';
    var core = s.slice(3, 12), sum = 0;
    for (var i = 0; i < 9; i++) sum += (+core[i]) * (10 - i);
    var c = (11 - sum % 11) % 11;
    return core + (c === 10 ? 'X' : String(c));
  }
  /* Restituisce l'ISBN-13 canonico, oppure '' se il codice non è valido. */
  function toIsbn13(s) {
    s = isbnClean(s);
    if (s.length === 13 && isbn13Valid(s)) return s;
    if (s.length === 10 && isbn10Valid(s)) return isbn10to13(s);
    return '';
  }
  function fmtIsbn(s) { return s; }
  /* Cerca ISBN validi dentro un testo libero (per esempio il risultato dell'OCR). */
  function extractIsbns(text) {
    var out = [], seen = {};
    var re = /[\dXx][\dXx\s\-–‐]{8,22}[\dXx]/g, m;
    var t = String(text || '');
    while ((m = re.exec(t))) {
      var v = toIsbn13(m[0]);
      if (v && !seen[v]) { seen[v] = 1; out.push(v); }
    }
    return out;
  }
  /* Da un testo incollato (uno o più codici) ricava ISBN validi e frammenti da segnalare. */
  function parseIsbnList(text) {
    var valid = [], invalid = [], seen = {};
    String(text || '').split(/[\r\n,;]+/).forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var whole = toIsbn13(line);
      if (whole) { if (!seen[whole]) { seen[whole] = 1; valid.push(whole); } return; }
      line.split(/\s+/).forEach(function (tok) {
        var digits = isbnClean(tok);
        if (digits.length < 9) return;
        var v = toIsbn13(tok);
        if (v) { if (!seen[v]) { seen[v] = 1; valid.push(v); } }
        else invalid.push(tok);
      });
      if (!whole && !valid.length && !invalid.length) invalid.push(line);
    });
    return { valid: valid, invalid: invalid };
  }

  /* ---------- banche dati ---------- */
  function httpsUrl(u) { return String(u || '').replace(/^http:\/\//i, 'https://'); }
  /* Le categorie di Google Libri sono in inglese ("Fiction / Thrillers"): tengo la prima parte e la traduco se la conosco. */
  var GENRE_IT = { 'fiction': 'Narrativa', 'history': 'Storia', 'biography & autobiography': 'Biografia', 'juvenile fiction': 'Ragazzi',
    'juvenile nonfiction': 'Ragazzi (saggistica)', 'young adult fiction': 'Ragazzi', 'poetry': 'Poesia', 'philosophy': 'Filosofia',
    'science': 'Scienza', 'travel': 'Viaggi', 'cooking': 'Cucina', 'religion': 'Religione', 'art': 'Arte', 'psychology': 'Psicologia',
    'literary criticism': 'Critica letteraria', 'social science': 'Scienze sociali', 'political science': 'Politica',
    'business & economics': 'Economia', 'comics & graphic novels': 'Fumetti', 'drama': 'Teatro', 'medical': 'Medicina',
    'nature': 'Natura', 'sports & recreation': 'Sport', 'music': 'Musica', 'education': 'Educazione', 'language arts & disciplines': 'Lingua',
    'law': 'Diritto', 'mathematics': 'Matematica', 'self-help': 'Crescita personale', 'health & fitness': 'Salute', 'true crime': 'Cronaca',
    'humor': 'Umorismo', 'literary collections': 'Antologie', 'foreign language study': 'Lingue straniere', 'architecture': 'Architettura',
    'photography': 'Fotografia', 'computers': 'Informatica', 'technology & engineering': 'Tecnologia', 'family & relationships': 'Famiglia',
    'body, mind & spirit': 'Spiritualità', 'games & activities': 'Giochi', 'games': 'Giochi', 'house & home': 'Casa', 'gardening': 'Giardinaggio',
    'pets': 'Animali', 'crafts & hobbies': 'Hobby', 'transportation': 'Trasporti', 'reference': 'Consultazione', 'study aids': 'Studio',
    'performing arts': 'Spettacolo', 'design': 'Design', 'antiques & collectibles': 'Collezionismo', 'bibles': 'Religione' };
  function genreIt(cat) {
    var c = str(Array.isArray(cat) ? cat[0] : cat).split(' / ')[0].trim();
    if (!c) return '';
    return GENRE_IT[c.toLowerCase()] || c;
  }
  function pagesOf(n) { var v = parseInt(n, 10); return v > 0 && v < 20000 ? String(v) : ''; }
  function parseGoogle(json) {
    var items = (json && Array.isArray(json.items)) ? json.items : [];
    return items.map(function (it) {
      var v = it.volumeInfo || {};
      var ids = (v.industryIdentifiers || []).map(function (x) { return toIsbn13(x.identifier); }).filter(Boolean);
      var title = str(v.title);
      if (title && v.subtitle) title += ': ' + str(v.subtitle);
      return {
        id: 'g:' + str(it.id),
        t: title,
        a: Array.isArray(v.authors) ? v.authors.map(str).filter(Boolean).join(', ') : '',
        e: str(v.publisher),
        y: yearOf(v.publishedDate),
        i: ids[0] || '',
        isbns: ids,
        img: httpsUrl(v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail)),
        lang: str(v.language),
        gen: genreIt(v.categories),
        pg: pagesOf(v.pageCount),
        src: 'Google Libri'
      };
    }).filter(function (c) { return c.t; });
  }
  function parseOpenLibrary(json, isbn) {
    var d = json && (json['ISBN:' + isbn] || json[Object.keys(json || {})[0]]);
    if (!d || typeof d !== 'object') return [];
    var title = str(d.title);
    if (title && d.subtitle) title += ': ' + str(d.subtitle);
    if (!title) return [];
    return [{
      id: 'o:' + isbn,
      t: title,
      a: Array.isArray(d.authors) ? d.authors.map(function (x) { return str(x && x.name); }).filter(Boolean).join(', ') : '',
      e: Array.isArray(d.publishers) ? d.publishers.map(function (x) { return str(x && x.name); }).filter(Boolean).join(', ') : '',
      y: yearOf(d.publish_date),
      i: isbn,
      isbns: [isbn],
      img: httpsUrl(d.cover && (d.cover.medium || d.cover.small || d.cover.large)),
      lang: '',
      gen: '',
      pg: pagesOf(d.number_of_pages),
      src: 'Open Library'
    }];
  }
  function mergeInto(base, extra) {
    if (!extra) return base;
    ['t', 'a', 'e', 'y', 'img', 'gen', 'pg'].forEach(function (k) { if (!base[k] && extra[k]) base[k] = extra[k]; });
    return base;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  /* GET JSON con timeout e nuovi tentativi quando il server risponde 429 o 5xx. Rifiuta con {status} o {net:true}. */
  async function getJson(f, url, opts) {
    var waits = (opts && opts.waits) || [800, 2200];
    var timeout = (opts && opts.timeout) || 12000;
    for (var n = 0; ; n++) {
      var r, ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = ctl ? setTimeout(function () { ctl.abort(); }, timeout) : null;
      try { r = await f(url, ctl ? { signal: ctl.signal } : undefined); }
      catch (e) { clearTimeout(timer); if (n < waits.length) { await sleep(waits[n]); continue; } throw { net: true }; }
      if (r.ok) {
        try { var j = await r.json(); clearTimeout(timer); return j; }
        catch (e2) { clearTimeout(timer); throw { status: 0, bad: true }; }
      }
      clearTimeout(timer);
      if ((r.status === 429 || r.status >= 500) && n < waits.length) { await sleep(waits[n]); continue; }
      throw { status: r.status };
    }
  }
  function openLibrarySearch(json, isbn) {
    var docs = (json && Array.isArray(json.docs)) ? json.docs : [];
    return docs.map(function (d) {
      return {
        id: 'o:' + str(d.key),
        t: str(d.title),
        a: Array.isArray(d.author_name) ? d.author_name.map(str).filter(Boolean).join(', ') : '',
        e: '',   // nella ricerca l'elenco editori riguarda tutte le edizioni dell'opera: meglio vuoto che sbagliato
        y: '',
        i: isbn, isbns: [isbn], img: '', lang: '', src: 'Open Library'
      };
    }).filter(function (c) { return c.t; });
  }
  /* Crossref: libri registrati con DOI (soprattutto editoria accademica). */
  var CROSSREF_URL = 'https://api.crossref.org/works?select=title,subtitle,author,editor,publisher,issued,type&rows=5&filter=isbn:';
  function parseCrossref(json, isbn) {
    var items = (json && json.message && Array.isArray(json.message.items)) ? json.message.items : [];
    var BOOK = /^(book|monograph|edited-book|reference-book|proceedings|book-set|book-series)$/;
    return items.filter(function (it) { return BOOK.test(str(it.type)); }).map(function (it) {
      var title = str(Array.isArray(it.title) ? it.title[0] : it.title);
      var sub = str(Array.isArray(it.subtitle) ? it.subtitle[0] : it.subtitle);
      if (title && sub) title += ': ' + sub;
      var people = (Array.isArray(it.author) && it.author.length ? it.author : (it.editor || []));
      var names = people.map(function (p) { return [str(p.given), str(p.family)].filter(Boolean).join(' ') || str(p.name); }).filter(Boolean);
      var dp = it.issued && it.issued['date-parts'] && it.issued['date-parts'][0];
      return { id: 'c:' + title, t: title, a: names.join(', '), e: str(it.publisher), y: yearOf(dp ? dp[0] : ''), i: isbn, isbns: [isbn], img: '', lang: '', src: 'Crossref' };
    }).filter(function (c) { return c.t; });
  }
  var SRC_ORDER = ['g', 'o', 'c'];   // per i campi contesi vince la prima fonte; quelli vuoti si riempiono con le altre
  /* Cerca un ISBN-13 su Google Libri e Open Library INSIEME (piu' veloce) e somma i dati: Google ha la precedenza,
     i campi che mancano (editore, anno, autore...) vengono presi dalle altre fonti. Crossref si aggiunge solo se ancora
     manca qualcosa. Ritorna il libro, oppure null SOLO se le banche dati principali hanno risposto e non lo conoscono.
     Se non lo trova e Google o Open Library hanno dato errore, rifiuta con {code:'rate'|'network', detail:[...]}:
     cosi' l'app propone "Riprova" invece di scrivere "Non trovato". */
  async function lookupIsbn(isbn, opts) {
    opts = opts || {};
    var f = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!f) throw { code: 'network', detail: ['nessun accesso a internet'] };
    var key = opts.gbKey ? '&key=' + encodeURIComponent(opts.gbKey) : '';
    var errors = [], rate = false;
    function note(src, e) {
      if (e && e.status === 429) rate = true;
      errors.push(src + ': ' + (e && e.status ? 'errore ' + e.status : (e && e.bad ? 'risposta non valida' : 'nessuna risposta')));
    }
    var got = { g: null, o: null, c: null };
    var gFailed = false, oFailed = false;
    function best() {
      var base = null;
      SRC_ORDER.forEach(function (k) { if (got[k]) { if (!base) base = Object.assign({}, got[k]); else mergeInto(base, got[k]); } });
      return base;
    }
    function complete() { var b = best(); return !!(b && b.t && b.a && b.e && b.y); }

    async function tryOl() {
      try {
        var j1 = await getJson(f, 'https://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json&jscmd=data', opts);
        var r1 = parseOpenLibrary(j1, isbn)[0] || null;
        if (r1) return r1;
      } catch (e) { /* si prova la ricerca */ }
      try {
        var j2 = await getJson(f, 'https://openlibrary.org/search.json?q=isbn:' + isbn + '&fields=key,title,author_name&limit=3', opts);
        return openLibrarySearch(j2, isbn)[0] || null;
      } catch (e2) { note('Open Library', e2); oFailed = true; return null; }
    }
    async function tryCrossref() {
      try { return parseCrossref(await getJson(f, CROSSREF_URL + isbn, { waits: [], timeout: 8000 }), isbn)[0] || null; }
      catch (e) { return null; }            // fonte accessoria: se non risponde si va avanti
    }
    async function google(q, strict) {
      var j = await getJson(f, 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(q) + '&maxResults=5&printType=books' + key, opts);
      var list = parseGoogle(j);
      var exact = list.filter(function (c) { return c.isbns.indexOf(isbn) >= 0; });
      // la ricerca "isbn:" e' precisa; le altre possono dare risultati simili ma sbagliati: servono ISBN identico
      return exact[0] || (strict ? null : list[0]) || null;
    }

    // 1) Google Libri e Open Library, insieme
    var first = await Promise.all([
      google('isbn:' + isbn, false).catch(function (e) { note('Google Libri', e); gFailed = true; return null; }),
      tryOl()
    ]);
    got.g = first[0]; got.o = first[1];
    // 2) Crossref solo se ancora manca qualcosa
    if (!complete()) got.c = await tryCrossref();
    // 3) ultima spiaggia per Google: codice semplice e ISBN-10 (solo se l'ISBN coincide)
    if (!got.g && !gFailed && !got.o && !got.c) {
      var alt = isbn13to10(isbn), more = [isbn].concat(alt ? ['isbn:' + alt] : []);
      for (var qi = 0; qi < more.length && !got.g; qi++) {
        try { got.g = await google(more[qi], true); } catch (e2) { note('Google Libri', e2); gFailed = true; break; }
      }
    }
    var book = best();
    if (!book) {
      if (gFailed || oFailed) throw { code: rate ? 'rate' : 'network', detail: errors };
      return null;
    }
    book.i = isbn;
    book.src = [got.g && 'Google Libri', got.o && 'Open Library', got.c && 'Crossref'].filter(Boolean).join(' + ');
    return book;
  }

  /* ---------- casa editrice dedotta dall'ISBN ---------- */
  /* L'ISBN contiene il codice dell'editore. Per l'Italia (gruppo 88) la lunghezza del codice dipende dal numero.
     Si impara dai libri gia' in elenco (che hanno ISBN e editore) e, in mancanza, da pochi editori molto noti. */
  var PUB_SEED = { '88-04': 'Mondadori', '88-06': 'Einaudi', '88-07': 'Feltrinelli', '88-11': 'Garzanti', '88-15': 'Il Mulino',
    '88-17': 'Rizzoli', '88-452': 'Bompiani', '88-459': 'Adelphi', '88-502': 'TEA' };
  function isbnPrefix(isbn) {
    var c = toIsbn13(isbn);
    if (!c || c.indexOf('97888') !== 0) return '';
    var reg = c.slice(5);                       // dopo 978-88
    var n = parseInt(reg.slice(0, 7), 10), len;
    if (n < 2000000) len = 2; else if (n < 6000000) len = 3; else if (n < 8500000) len = 4;
    else if (n < 9000000) len = 5; else if (n < 9500000) len = 6; else len = 7;
    return '88-' + reg.slice(0, len);
  }
  /* books: [{i, e, g}] gia' in elenco. Ritorna {name, learned} oppure null. Le deduzioni gia' segnate "da verificare" non fanno scuola. */
  function guessPublisher(isbn, books) {
    var p = isbnPrefix(isbn);
    if (!p) return null;
    var count = {}, best = '', bn = 0;
    (books || []).forEach(function (b) {
      if (!b || !b.e || (b.g || []).indexOf('e') >= 0 || isbnPrefix(b.i) !== p) return;
      var k = b.e.trim(); count[k] = (count[k] || 0) + 1;
      if (count[k] > bn) { bn = count[k]; best = k; }
    });
    if (best) return { name: best, learned: true };
    return PUB_SEED[p] ? { name: PUB_SEED[p], learned: false } : null;
  }

  /* Prova le banche dati con un ISBN noto e dice cosa risponde ciascuna (per la diagnosi nelle Opzioni). */
  async function diagnose(opts) {
    opts = opts || {};
    var f = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    var key = opts.gbKey ? '&key=' + encodeURIComponent(opts.gbKey) : '';
    var out = [];
    async function probe(name, url, check, noReply) {
      var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
      try {
        var r = await f(url, ctl ? { signal: ctl.signal } : undefined);
        clearTimeout(timer);
        if (!r.ok) { out.push({ name: name, ok: false, msg: r.status === 429 ? 'limite di richieste raggiunto (429)' : 'errore ' + r.status }); return; }
        var j = await r.json();
        out.push({ name: name, ok: true, msg: check(j) });
      } catch (e) { clearTimeout(timer); out.push({ name: name, ok: false, msg: noReply || 'nessuna risposta (rete assente, bloccata o sito non raggiungibile)' }); }
    }
    await probe('Google Libri', 'https://www.googleapis.com/books/v1/volumes?q=isbn:9788806219352&maxResults=1' + key,
      function (j) { var l = parseGoogle(j); return l.length ? 'risponde: ' + l[0].t : 'risponde ma non trova il libro di prova'; });
    await probe('Open Library', 'https://openlibrary.org/api/books?bibkeys=ISBN:9780140328721&format=json&jscmd=data',
      function (j) { var l = parseOpenLibrary(j, '9780140328721'); return l.length ? 'risponde: ' + l[0].t : 'risponde ma non trova il libro di prova'; });
    await probe('Crossref', CROSSREF_URL.replace('rows=5', 'rows=1') + '9780262033848',
      function (j) { return (j && j.message) ? 'risponde' : 'risposta non valida'; });
    return out;
  }
  async function searchText(query, opts) {
    opts = opts || {};
    var f = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!f) throw { code: 'network' };
    var key = opts.gbKey ? '&key=' + encodeURIComponent(opts.gbKey) : '';
    try {
      return parseGoogle(await getJson(f, 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query) + '&maxResults=10&printType=books' + key, opts));
    } catch (e) { throw { code: e && e.status === 429 ? 'rate' : 'network' }; }
  }

  /* ---------- lettura della copertina (OCR) ---------- */
  var STOP = { il: 1, lo: 1, la: 1, le: 1, gli: 1, un: 1, uno: 1, una: 1, di: 1, del: 1, della: 1, dei: 1, delle: 1, dello: 1, degli: 1, da: 1, per: 1, con: 1, che: 1, the: 1, and: 1, of: 1, for: 1, ed: 1, nel: 1, nella: 1, sul: 1, sulla: 1, edizione: 1, romanzo: 1, nuova: 1 };
  function tokens(s) {
    var seen = {}, out = [];
    norm(s).split(/[^a-z0-9]+/).forEach(function (w) {
      if (w.length < 3 || STOP[w] || /^\d+$/.test(w) || seen[w]) return;
      seen[w] = 1; out.push(w);
    });
    return out;
  }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function fuzzyHas(list, tok) {
    var max = tok.length >= 8 ? 2 : (tok.length >= 5 ? 1 : 0);
    for (var i = 0; i < list.length; i++) {
      if (list[i] === tok) return true;
      if (max && lev(list[i], tok, max) <= max) return true;
    }
    return false;
  }
  /* Da data.lines di tesseract.js a righe semplici {text, h, conf}. */
  function ocrLines(data) {
    var raw = (data && Array.isArray(data.lines)) ? data.lines : [];
    return raw.map(function (l) {
      var b = l.bbox || {};
      return { text: str(l.text).replace(/\s+/g, ' ').trim(), h: Math.max(0, (b.y1 || 0) - (b.y0 || 0)), y: b.y0 || 0, conf: Number(l.confidence) || 0 };
    }).filter(function (l) { return l.text; });
  }
  function goodLines(lines) {
    return lines.filter(function (l) {
      var letters = (l.text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
      return l.conf >= 35 && letters >= 3 && letters / l.text.length >= 0.55;
    });
  }
  function topLines(lines) {
    var g = goodLines(lines).slice().sort(function (a, b) { return b.h - a.h; });
    if (!g.length) return [];
    var maxH = g[0].h;
    return g.filter(function (l) { return l.h >= maxH * 0.55; }).slice(0, 4);
  }
  /* Dal solo testo letto: le righe più grandi sono il titolo, le successive l'autore. */
  function splitTitleAuthor(lines) {
    var good = goodLines(lines).slice().sort(function (a, b) { return b.h - a.h; });
    if (!good.length) return { t: '', a: '' };
    function cluster(arr) {
      var m = arr[0].h;
      return arr.filter(function (l) { return l.h >= m * 0.78; }).sort(function (a, b) { return (a.y || 0) - (b.y || 0); });
    }
    function join(c) { return c.map(function (l) { return l.text; }).join(' ').replace(/\s+/g, ' ').trim(); }
    var c1 = cluster(good);
    var rest = good.filter(function (l) { return c1.indexOf(l) < 0; });
    var a = rest.length ? join(cluster(rest)) : '';
    if (a && (a.split(' ').length > 5 || /\d/.test(a))) a = '';
    return { t: join(c1), a: a };
  }
  function buildQueries(lines) {
    var top = topLines(lines), all = goodLines(lines).slice().sort(function (a, b) { return b.h - a.h; });
    var qs = [];
    function add(arr, n) {
      var q = arr.slice(0, n).join(' ').trim();
      if (q && qs.indexOf(q) < 0) qs.push(q);
    }
    var topTok = tokens(top.map(function (l) { return l.text; }).join(' '));
    var allTok = tokens(all.map(function (l) { return l.text; }).join(' '));
    add(topTok, 7);
    if (top[0]) add(tokens(top[0].text), 6);
    add(allTok, 9);
    return qs.slice(0, 3);
  }
  function scoreCandidate(c, lines) {
    var all = tokens(goodLines(lines).map(function (l) { return l.text; }).join(' '));
    var top = tokens(topLines(lines).map(function (l) { return l.text; }).join(' '));
    var ct = tokens(c.t + ' ' + c.a);
    if (!ct.length || !all.length) return 0;
    var hits = ct.filter(function (w) { return fuzzyHas(all, w); }).length;
    var cov = hits / ct.length;
    var topHit = top.length ? top.filter(function (w) { return fuzzyHas(ct, w); }).length / top.length : 0;
    return 0.6 * cov + 0.4 * topHit;
  }
  /* Raggruppa le edizioni dello stesso libro, assegna un punteggio e ordina. */
  function rankCandidates(cands, lines) {
    var groups = {};
    var allText = norm(lines.map(function (l) { return l.text; }).join(' '));
    cands.forEach(function (c) {
      var key = norm(c.t).replace(/[^a-z0-9]+/g, ' ').trim() + '|' + norm(c.a).replace(/[^a-z0-9]+/g, ' ').trim();
      var rep = groups[key];
      var pubHit = c.e && allText.indexOf(norm(c.e)) >= 0;
      var rank = (pubHit ? 4 : 0) + (c.lang === 'it' ? 2 : 0) + (c.e ? 1 : 0) + (c.y ? 0.5 : 0) + (c.img ? 0.25 : 0);
      if (!rep || rank > rep._rank) groups[key] = Object.assign({}, c, { _rank: rank });
    });
    var out = Object.keys(groups).map(function (k) {
      var c = groups[k];
      c.score = scoreCandidate(c, lines);
      return c;
    });
    out.sort(function (a, b) { return b.score - a.score || b._rank - a._rank; });
    return out;
  }
  function strongMatch(ranked) {
    if (!ranked.length) return false;
    var best = ranked[0], second = ranked[1];
    return best.score >= 0.7 && (!second || best.score - second.score >= 0.15);
  }
  function extractPrice(text) {
    var t = String(text || '').replace(/\s+/g, ' ');
    var m = t.match(/(?:€|EUR|Euro)\s*(\d{1,3}[.,]\d{2})\b/i) || t.match(/\b(\d{1,3}[.,]\d{2})\s*(?:€|EUR|euro)/i) || t.match(/(?:^|\s)E\s?(\d{1,3},\d{2})\b/);
    if (!m) return null;
    var n = parseNum(m[1]);
    return n && n > 0 && n < 500 ? n : null;
  }

  /* Versioni piu' grandi di una copertina: Open Library grande, immagine dell'editore su Google, Open Library per ISBN.
     Nessuna e' garantita: l'app le prova e tiene solo quelle che arrivano davvero e hanno le proporzioni di una copertina. */
  function coverCandidates(img, isbn) {
    var out = [], u = str(img);
    var ol = u.match(/^(https:\/\/covers\.openlibrary\.org\/b\/(?:id|isbn|olid)\/[^\/?]+?)-[SM]\.jpg/i);
    if (ol) out.push(ol[1] + '-L.jpg');
    var g = /books\.google(?:usercontent)?\.[a-z.]+\//i.test(u) && u.match(/[?&]id=([\w-]+)/);
    if (g) out.push('https://books.google.com/books/publisher/content/images/frontcover/' + g[1] + '?fife=w800-h1200&source=gbs_api');
    var c = toIsbn13(isbn);
    if (c) out.push('https://covers.openlibrary.org/b/isbn/' + c + '-L.jpg?default=false');
    return out.filter(function (x, i) { return x !== u && out.indexOf(x) === i; });
  }

  /* ---------- export ---------- */
  /* Colonne: le prime 6 sempre; le altre solo se almeno un libro ha quel dato. type: s testo, n numero, c euro, x testo forzato (ISBN). */
  var COLS = [
    { k: 't', h: 'Titolo', w: 42 }, { k: 'a', h: 'Autore', w: 28 }, { k: 'e', h: 'Casa editrice', w: 22 },
    { k: 'y', h: 'Anno', w: 7, type: 'n' }, { k: 'c', h: 'Costo', w: 11, type: 'c' }, { k: 'i', h: 'ISBN', w: 16, type: 'x' },
    { k: 'sh', h: 'Scaffale', w: 16, opt: true }, { k: 'gen', h: 'Genere', w: 16, opt: true }, { k: 'pg', h: 'Pagine', w: 8, type: 'n', opt: true },
    { k: 'n', h: 'Note', w: 36, opt: true }, { k: 'p', h: 'Prestato a', w: 16, opt: true }, { k: 'pd', h: 'Data prestito', w: 13, opt: true }
  ];
  function colsFor(books) {
    return COLS.filter(function (c) { return !c.opt || books.some(function (b) { return b[c.k] != null && String(b[c.k]) !== ''; }); });
  }
  function itDate(iso) { var m = String(iso || '').match(/^(\d{4})-(\d\d)-(\d\d)$/); return m ? m[3] + '/' + m[2] + '/' + m[1] : str(iso); }
  function cellText(b, c) {
    var v = b[c.k];
    if (c.k === 'c') return v == null ? '' : fmtNum(v);
    if (c.k === 'pd') return itDate(v);
    return v == null ? '' : String(v);
  }
  function rowsFor(books) {
    var cols = colsFor(books);
    return [cols.map(function (c) { return c.h; })].concat(books.map(function (b) { return cols.map(function (c) { return cellText(b, c); }); }));
  }
  function csvCell(v, delim) {
    var s = String(v == null ? '' : v);
    if (/^[=+@]/.test(s)) s = "'" + s;
    return /["\n\r]/.test(s) || s.indexOf(delim) >= 0 ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function buildCSV(books) {
    return '﻿' + rowsFor(books).map(function (r) { return r.map(function (v) { return csvCell(v, ';'); }).join(';'); }).join('\r\n');
  }
  function buildTSV(books) {
    var clean = function (v) { return String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' '); };
    return rowsFor(books).map(function (r) { return r.map(clean).join('\t'); }).join('\n');
  }

  /* --- file Excel (.xlsx) costruito a mano: un archivio zip (senza compressione) con pochi file XML --- */
  var CRC = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function utf8(s) { return new TextEncoder().encode(s); }
  function zipStore(files, date) {
    var d = date || new Date();
    var dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    var dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    var parts = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = utf8(f.name), data = typeof f.data === 'string' ? utf8(f.data) : f.data, crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, dosTime, true); h.setUint16(12, dosDate, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, dosTime, true); c.setUint16(14, dosDate, true); c.setUint32(16, crc, true);
      c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
      c.setUint32(42, offset, true);
      central.push(new Uint8Array(c.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var cdSize = central.reduce(function (n, p) { return n + p.length; }, 0);
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, cdSize, true); e.setUint32(16, offset, true);
    var all = parts.concat(central, [new Uint8Array(e.buffer)]);
    var out = new Uint8Array(all.reduce(function (n, p) { return n + p.length; }, 0)), pos = 0;
    all.forEach(function (p) { out.set(p, pos); pos += p.length; });
    return out;
  }
  function xmlEsc(s) {
    return String(s == null ? '' : s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function colLetter(i) { var s = ''; i++; while (i) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function buildXLSX(books, sheetName, date) {
    var cols = colsFor(books), name = xmlEsc(String(sheetName || 'Libreria').replace(/[\\\/?*\[\]:]/g, ' ').slice(0, 31));
    var last = colLetter(cols.length - 1) + (books.length + 1);
    function txt(ref, v, st) { return '<c r="' + ref + '" t="inlineStr"' + (st ? ' s="' + st + '"' : '') + '><is><t xml:space="preserve">' + xmlEsc(v) + '</t></is></c>'; }
    var rows = ['<row r="1">' + cols.map(function (c, i) { return txt(colLetter(i) + '1', c.h, 1); }).join('') + '</row>'];
    books.forEach(function (b, r) {
      var rn = r + 2;
      rows.push('<row r="' + rn + '">' + cols.map(function (c, i) {
        var ref = colLetter(i) + rn, v = b[c.k];
        if (v == null || v === '') return '';
        if (c.type === 'c') return typeof v === 'number' && isFinite(v) ? '<c r="' + ref + '" s="2"><v>' + v + '</v></c>' : '';
        if (c.type === 'n') { var n = parseInt(v, 10); return isFinite(n) && String(n) === String(v).trim() ? '<c r="' + ref + '"><v>' + n + '</v></c>' : txt(ref, v); }
        if (c.type === 'x') return txt(ref, v, 3);
        return txt(ref, c.k === 'pd' ? itDate(v) : v);
      }).join('') + '</row>');
    });
    var NS = 'http://schemas.openxmlformats.org/', M = NS + 'spreadsheetml/2006/main', R = NS + 'officeDocument/2006/relationships';
    var head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    var sheet = head + '<worksheet xmlns="' + M + '" xmlns:r="' + R + '"><dimension ref="A1:' + last + '"/>' +
      '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
      '<sheetFormatPr defaultRowHeight="15"/><cols>' + cols.map(function (c, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + c.w + '" customWidth="1"/>'; }).join('') + '</cols>' +
      '<sheetData>' + rows.join('') + '</sheetData><autoFilter ref="A1:' + last + '"/></worksheet>';
    var styles = head + '<styleSheet xmlns="' + M + '"><numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00\\ &quot;€&quot;"/></numFmts>' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDCEEE6"/><bgColor indexed="64"/></patternFill></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
      '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
      '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>' +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    var workbook = head + '<workbook xmlns="' + M + '" xmlns:r="' + R + '"><sheets><sheet name="' + name + '" sheetId="1" r:id="rId1"/></sheets>' +
      '<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">\'' + name.replace(/'/g, "''") + '\'!$A$1:$' + last.replace(/(\d+)$/, '$$$1') + '</definedName></definedNames></workbook>';
    var PR = NS + 'package/2006/relationships';
    return zipStore([
      { name: '[Content_Types].xml', data: head + '<Types xmlns="' + NS + 'package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
      { name: '_rels/.rels', data: head + '<Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + R + '/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: workbook },
      { name: 'xl/_rels/workbook.xml.rels', data: head + '<Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + R + '/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="' + R + '/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: styles },
      { name: 'xl/worksheets/sheet1.xml', data: sheet }
    ], date);
  }

  /* ---------- case editrici scritte in modi diversi ---------- */
  var PUB_STOP = { casa: 1, editrice: 1, editore: 1, editori: 1, edizioni: 1, edizione: 1, ed: 1, edit: 1, spa: 1, srl: 1, sas: 1, snc: 1,
    publishing: 1, publishers: 1, publisher: 1, press: 1, books: 1, libri: 1, gruppo: 1, editoriale: 1, group: 1, italia: 1, the: 1,
    inc: 1, ltd: 1, co: 1, di: 1, de: 1, del: 1, della: 1, dei: 1, e: 1, s: 1, p: 1, a: 1, r: 1, l: 1 };
  function pubTokens(name) { return norm(name).replace(/&/g, ' e ').split(/[^a-z0-9]+/).filter(function (t) { return t && !PUB_STOP[t]; }); }
  /* Gruppi di nomi che sembrano la stessa casa editrice: stesso nome a parte maiuscole/"Editore"/"Edizioni", un nome contenuto
     nell'altro ("Mondadori" e "Arnoldo Mondadori Editore"), oppure libri con lo stesso codice editore nell'ISBN. Solo proposte. */
  function publisherGroups(books) {
    var count = {}, names = [];
    (books || []).forEach(function (b) { var e = str(b && b.e).trim(); if (!e) return; if (!count[e]) { count[e] = 0; names.push(e); } count[e]++; });
    var parent = {};
    function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
    function join(a, b) { var ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; }
    names.forEach(function (n) { parent[n] = n; });
    var toks = {}, key = {}, byKey = {};
    names.forEach(function (n) { toks[n] = pubTokens(n); key[n] = toks[n].join(''); if (key[n]) { if (byKey[key[n]]) join(n, byKey[key[n]]); else byKey[key[n]] = n; } });
    for (var i = 0; i < names.length; i++) for (var j = i + 1; j < names.length; j++) {
      var A = toks[names[i]], B = toks[names[j]];
      if (!A.length || !B.length) continue;
      var small = A.length <= B.length ? A : B, big = small === A ? B : A;
      if (small.some(function (t) { return t.length >= 3; }) && small.every(function (t) { return big.indexOf(t) >= 0; })) join(names[i], names[j]);
    }
    var byPrefix = {};
    (books || []).forEach(function (b) {
      var e = str(b && b.e).trim(), p = isbnPrefix(b && b.i);
      if (!e || !p) return;
      if (byPrefix[p]) join(e, byPrefix[p]); else byPrefix[p] = e;
    });
    var groups = {};
    names.forEach(function (n) { var r = find(n); (groups[r] = groups[r] || []).push(n); });
    return Object.keys(groups).map(function (r) { return groups[r]; }).filter(function (g) { return g.length > 1; }).map(function (g) {
      var list = g.map(function (n) { return { name: n, count: count[n] }; }).sort(function (x, y) { return y.count - x.count || x.name.length - y.name.length || (x.name < y.name ? -1 : 1); });
      return { names: list, suggested: list[0].name, total: list.reduce(function (a, x) { return a + x.count; }, 0) };
    }).sort(function (x, y) { return y.total - x.total; });
  }

  /* ---------- statistiche ---------- */
  function top(map, n) {
    return Object.keys(map).map(function (k) { return { k: k, n: map[k] }; })
      .sort(function (a, b) { return b.n - a.n || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0); }).slice(0, n || 8);
  }
  function computeStats(books) {
    var st = { n: 0, total: 0, priced: 0, pages: 0, paged: 0, guess: 0, noPrice: 0, loans: [], authors: {}, publishers: {}, genres: {}, shelves: {}, decades: {} };
    (books || []).forEach(function (b) {
      st.n++;
      if (typeof b.c === 'number' && isFinite(b.c)) { st.total += b.c; st.priced++; } else st.noPrice++;
      var pg = parseInt(b.pg, 10); if (pg > 0) { st.pages += pg; st.paged++; }
      if (b.g && b.g.length) st.guess++;
      if (b.p) st.loans.push({ id: b.id, t: b.t || b.i || 'Senza titolo', p: b.p, pd: b.pd || '' });
      str(b.a).split(/\s*,\s*/).filter(Boolean).forEach(function (a) { st.authors[a] = (st.authors[a] || 0) + 1; });
      if (b.e) st.publishers[b.e] = (st.publishers[b.e] || 0) + 1;
      if (b.gen) st.genres[b.gen] = (st.genres[b.gen] || 0) + 1;
      if (b.sh) st.shelves[b.sh] = (st.shelves[b.sh] || 0) + 1;
      var y = parseInt(b.y, 10); if (y > 1000) { var d = Math.floor(y / 10) * 10; st.decades[d] = (st.decades[d] || 0) + 1; }
    });
    st.avg = st.priced ? st.total / st.priced : 0;
    st.loans.sort(function (a, b) { return a.pd < b.pd ? -1 : a.pd > b.pd ? 1 : 0; });
    st.topAuthors = top(st.authors, 8); st.topPublishers = top(st.publishers, 8); st.topGenres = top(st.genres, 8); st.topShelves = top(st.shelves, 10);
    st.byDecade = Object.keys(st.decades).map(Number).sort(function (a, b) { return a - b; }).map(function (d) { return { k: d + '–' + (d + 9), n: st.decades[d] }; });
    return st;
  }
  /* "oggi", "ieri", "3 giorni fa", "2 settimane fa", "4 mesi fa" */
  function agoText(ts, now) {
    if (!ts) return 'mai';
    var days = Math.floor(((now || Date.now()) - ts) / 86400000);
    if (days <= 0) return 'oggi';
    if (days === 1) return 'ieri';
    if (days < 14) return days + ' giorni fa';
    if (days < 60) return Math.floor(days / 7) + ' settimane fa';
    if (days < 730) return Math.floor(days / 30) + ' mesi fa';
    return Math.floor(days / 365) + ' anni fa';
  }

  return {
    str: str, norm: norm, parseNum: parseNum, fmtNum: fmtNum, yearOf: yearOf,
    sortKeyTitle: sortKeyTitle, sortKeyAuthor: sortKeyAuthor,
    isbnClean: isbnClean, isbn13Valid: isbn13Valid, isbn10Valid: isbn10Valid, isbn10to13: isbn10to13, isbn13to10: isbn13to10,
    toIsbn13: toIsbn13, fmtIsbn: fmtIsbn, extractIsbns: extractIsbns, parseIsbnList: parseIsbnList,
    parseGoogle: parseGoogle, parseOpenLibrary: parseOpenLibrary, lookupIsbn: lookupIsbn, parseCrossref: parseCrossref, isbnPrefix: isbnPrefix, guessPublisher: guessPublisher, diagnose: diagnose, openLibrarySearch: openLibrarySearch, searchText: searchText,
    tokens: tokens, fuzzyHas: fuzzyHas, splitTitleAuthor: splitTitleAuthor, ocrLines: ocrLines, goodLines: goodLines, topLines: topLines, buildQueries: buildQueries,
    scoreCandidate: scoreCandidate, rankCandidates: rankCandidates, strongMatch: strongMatch, extractPrice: extractPrice,
    csvCell: csvCell, buildCSV: buildCSV, buildTSV: buildTSV, rowsFor: rowsFor, colsFor: colsFor, itDate: itDate,
    genreIt: genreIt, crc32: crc32, zipStore: zipStore, buildXLSX: buildXLSX, publisherGroups: publisherGroups, pubTokens: pubTokens,
    computeStats: computeStats, agoText: agoText, coverCandidates: coverCandidates
  };
});
