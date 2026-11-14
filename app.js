(function () {
'use strict';
var L = window.Lib;

/* ---------- utilità ---------- */
var $ = function (s) { return document.querySelector(s); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var ls = {
  get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
};
var ICON = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  scan: '<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8 8v8M11 8v8M14 8v8M17 8v8"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  euro: '<path d="M17.5 6.8A6.5 6.5 0 0 0 7 12a6.5 6.5 0 0 0 10.5 5.2M5 10.5h9M5 13.5h9"/>',
  key: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  redo: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  fav: '<path d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-4-6 4v-16a1 1 0 0 1 1-1z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.1-4.1M8.2 13.2l7.1 4.1"/>',
  pricetag: '<path d="M3.5 12V5a1.5 1.5 0 0 1 1.5-1.5h7l8.5 8.5a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8.2" cy="8.2" r="1.5"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  filt: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  chart: '<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
  check: '<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  loan: '<path d="M5 4h9a2 2 0 0 1 2 2v3M5 4v14a2 2 0 0 0 2 2h7"/><path d="M13 15h8M18 12l3 3-3 3"/>',
  bag: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M9.5 14l2 2 3.5-3.5"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  swap: '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
  tolib: '<path d="M2.5 20.5h14"/><path d="M4 20.5V10h3v10.5M4 12.5h3M4 18h3"/><path d="M8.2 20.5V7.5h3.4v13M8.2 10h3.4M8.2 18h3.4"/><path d="M12.8 20.5l2-8.4 2.7.6-1.9 7.8"/><path d="M19.5 2.5v8.5M16.5 8l3 3 3-3"/>',
  towish: '<path d="M8.8 20.5S2.5 16.9 2.5 12.6A3.2 3.2 0 0 1 8.8 11a3.2 3.2 0 0 1 6.3 1.6c0 4.3-6.3 7.9-6.3 7.9z"/><path d="M19.5 2.5v8.5M16.5 8l3 3 3-3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  pub: '<path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-6h6v6M4 20h16"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  shelf: '<path d="M4 4v16M20 4v16M4 9h16M4 15h16"/><path d="M8 9V5M11 9V6M15 15v-4"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  left: '<path d="M15 5l-7 7 7 7"/>'
};
/* qualche icona disegnata apposta per l'aspetto «Nuovo» */
var ICON_NEW = {
  loan: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M7 8h1.5"/><path d="M14 12h7M18 8.5l3.5 3.5-3.5 3.5"/>',
  bag: '<path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'
};
function icon(n) { var p = (document.documentElement.getAttribute('data-look') === 'nuovo' && ICON_NEW[n]) || ICON[n]; return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
$('#btnScan').innerHTML = icon('scan') + 'Scansiona';
$('#icoFilt').innerHTML = icon('filt');
$('#edgeTab').innerHTML = icon('right');
$('#btnOpts').innerHTML = icon('gear');
$('#optBack').innerHTML = icon('left');
$('#photoCam').innerHTML = icon('cam') + 'Scatta una foto';
$('#photoGal').innerHTML = icon('img') + 'Scegli dalla galleria';
$('#scanPriceIco').innerHTML = icon('key');
$('#btnPhoto').innerHTML = icon('cam') + 'Foto';
$('#btnType').innerHTML = icon('key') + 'Digita';
$('#btnCheck').innerHTML = icon('check') + 'Ce l\'ho già?';
$('#icoLoan').innerHTML = icon('loan');
$('#btnStats').innerHTML = icon('chart') + 'Statistiche';
$('#btnExport').innerHTML = icon('down') + 'Esporta';

function pool(n) {
  var active = 0, q = [];
  function next() {
    while (active < n && q.length) {
      var f = q.shift(); active++;
      f().then(function () { active--; next(); }, function () { active--; next(); });
    }
  }
  return function (fn) { return new Promise(function (res, rej) { q.push(function () { return fn().then(res, rej); }); next(); }); };
}
var lookupPool = pool(2), photoPool = pool(1), coverPool = pool(2);
var eurFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
var coll = new Intl.Collator('it', { sensitivity: 'base', numeric: true });

/* ---------- stato ---------- */
var LS_KEY = 'catalogo-libri-v2', LS_SET = 'catalogo-libri-set';
/* versione dell'app: la stessa di version.json e del nome della cache in sw.js (si aggiornano insieme) */
var APP_VERSION = { v: 54, date: '2026-11-14', note: 'Descrizione del libro nella scheda aperta' };
var state = { books: [], updated: 0 };
var S = {};                                  // stato di sessione per riga: st, msg, thumb, err, cands, lines, price, retry
var settings = { gbKey: '', price: true, extra: true, lastBackup: 0, snooze: 0, view: 'list', openAll: false, sbnUrl: '', loanSnooze: 0, look: 'nuovo', theme: 'light', pal: 'bosco', ft: 'literata', fb: 'plex' };
var PALS = { inchiostro: ['#EDF0F5', '#10141D'], bordeaux: ['#F2EFEE', '#161112'], bosco: ['#EEF1EE', '#0F1513'] };
var FONTS_T = ['literata', 'garamond', 'playfair', 'lora', 'merriweather', 'montserrat', 'roboto'], FONTS_B = ['plex', 'roboto', 'lato', 'atkinson', 'lora'];
var openState = {};
function collapseCards() { if (!settings.openAll) openState = {}; }   // quando si filtra l'elenco torna compatto   // schede aperte/chiuse in questa sessione (true/false); se manca vale la regola di isOpen
var q = '', sortBy = 'recent', flt = '', tab = 'lib', readFlt = '', shFlt = '', genFlt = '', autFlt = '', autName = '', edFlt = '';   // shFlt, genFlt: chiave normalizzata, NONE = senza   // flt: '' | 'guess' | 'loan'; tab: 'lib' (Libreria) | 'wish' (Desideri)
var tSave = null, toastTimer = null, scanning = false, offlineNoted = false;

function newId() { return 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function get(id) { for (var i = 0; i < state.books.length; i++) if (state.books[i].id === id) return state.books[i]; return null; }
function smallImg(b) { var s = S[b.id] || {}; return coverURL[b.id] || b.img || b.imgL || s.thumb || ''; }
function bigImg(b) { var s = S[b.id] || {}; return coverURL[b.id] || b.imgL || b.img || s.big || s.thumb || ''; }
/* Richieste di oggi a Google Libri e al worker SBN. Il giorno di Google finisce a mezzanotte ora del Pacifico (le 9 da noi),
   quello di Cloudflare a mezzanotte UTC (l'1 o le 2 di notte da noi). */
var G_LIMIT = 1000, G_STOP = 950, G_EXTRA = 700;          // con la chiave: 1.000 al giorno; le copertine grandi si fermano prima
var quota = { d: '', g: 0, ds: '', s: 0 };
function pacificDay() { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
function utcDay() { return new Date().toISOString().slice(0, 10); }
function loadQuota() { try { var q = JSON.parse(ls.get('catalogo-libri-quota') || '{}'); if (q && q.d) quota = { d: q.d, g: q.g | 0, ds: q.ds || q.d, s: q.s | 0 }; } catch (e) {} }
function rollQuota() {
  var d = pacificDay(), ds = utcDay();
  if (quota.d !== d) { quota.d = d; quota.g = 0; }
  if (quota.ds !== ds) { quota.ds = ds; quota.s = 0; }
}
function countCall(k) { rollQuota(); quota[k]++; ls.set('catalogo-libri-quota', JSON.stringify(quota)); if ($('#optSheet').hidden) return; updateQuotaInfo(); }
function googleLeft(extra) { rollQuota(); return !settings.gbKey || quota.g < (extra ? G_EXTRA : G_STOP); }
function updateQuotaInfo() {
  rollQuota();
  var nf = new Intl.NumberFormat('it-IT');
  $('#gbCount').innerHTML = 'Richieste oggi: <b>' + nf.format(quota.g) + '</b>' + (settings.gbKey
    ? ' su 1.000 · si azzera verso le 9' + (quota.g >= G_STOP ? '. Limite quasi raggiunto: le ricerche riprendono domattina' : quota.g >= G_EXTRA ? '. Le copertine grandi aspettano domani' : '')
    : ' · senza chiave il limite lo decide Google');
  $('#sbnCount').innerHTML = 'Richieste oggi: <b>' + nf.format(quota.s) + '</b>' + (settings.sbnUrl ? ' su 100.000 · si azzera nella notte' : '');
}
/* Worker SBN e chiave Google: quelli usati restano tra i «salvati» (anche dopo «Cancella») per rimetterli con un tocco */
var LS_SAVED = 'catalogo-libri-saved', saved = { sbn: [], key: [] };
function loadSaved() {
  try {
    var o = JSON.parse(ls.get(LS_SAVED) || '{}');
    ['sbn', 'key'].forEach(function (k) { saved[k] = Array.isArray(o[k]) ? o[k].filter(function (x) { return typeof x === 'string' && x; }).slice(0, 4) : []; });
  } catch (e) {}
  if (settings.sbnUrl && saved.sbn.indexOf(settings.sbnUrl) < 0) remember('sbn', settings.sbnUrl);
  if (settings.gbKey && saved.key.indexOf(settings.gbKey) < 0) remember('key', settings.gbKey);
}
function remember(k, v) { if (!v) return; saved[k] = [v].concat(saved[k].filter(function (x) { return x !== v; })).slice(0, 4); ls.set(LS_SAVED, JSON.stringify(saved)); }
function svcVal(k) { return k === 'sbn' ? settings.sbnUrl : settings.gbKey; }
function svcShort(k, v) { return k === 'sbn' ? v.replace(/^https:\/\//, '') : (v.length > 14 ? v.slice(0, 6) + '…' + v.slice(-4) : v); }
function setSvc(k, v) {
  if (k === 'sbn') settings.sbnUrl = v; else settings.gbKey = v;
  backupReady = null;
  saveSettings(); remember(k, v); renderSvc();
}
function renderSvc() {
  var sb = settings.sbnUrl, gk = settings.gbKey;
  if (document.activeElement !== $('#sbnUrl')) $('#sbnUrl').value = sb;
  if (document.activeElement !== $('#gbKey')) $('#gbKey').value = gk;
  $('#sbnSt').textContent = sb ? 'In uso' : 'Non impostato'; $('#sbnSt').className = 'svc-st' + (sb ? ' on' : '');
  $('#gbSt').textContent = gk ? 'In uso' : 'Nessuna chiave'; $('#gbSt').className = 'svc-st' + (gk ? ' on' : '');
  $('#sbnClear').hidden = !sb; $('#gbClear').hidden = !gk;
  ['sbn', 'key'].forEach(function (k) {
    var cur = svcVal(k), box = $(k === 'sbn' ? '#sbnSaved' : '#gbSaved'), html = '';
    saved[k].forEach(function (x, i) {
      if (x === cur) return;
      html += '<span class="schip"><button type="button" class="schip-use" data-k="' + k + '" data-i="' + i + '" title="Usa ' + esc(svcShort(k, x)) + '">' + esc(svcShort(k, x)) + '</button>' +
        '<button type="button" class="schip-x" data-k="' + k + '" data-forget="' + i + '" aria-label="Togli ' + esc(svcShort(k, x)) + ' dai salvati">×</button></span>';
    });
    box.innerHTML = html ? '<span class="svc-saved-l">' + (k === 'sbn' ? 'Worker salvati:' : 'Chiavi salvate:') + '</span>' + html : '';
    box.hidden = !html;
  });
  var rs = !sb && saved.sbn.length, rk = !gk && saved.key.length;
  $('#svcRestore').hidden = !(rs || rk);
  $('#svcRestore').textContent = rs && rk ? 'Rimetti chiave e worker salvati' : rs ? 'Rimetti il worker salvato' : 'Rimetti la chiave salvata';
  updateQuotaInfo();
}
/* fetch che conta le richieste e, con la chiave, non supera il limite giornaliero di Google (ne lascia un margine) */
function apiFetch(url, init) {
  var u = String(url);
  if (/googleapis\.com\/books\//.test(u)) {
    var extra = /\/volumes\/[^?]/.test(u);                  // scheda del volume = solo per la copertina grande
    if (!googleLeft(extra)) return Promise.resolve({ ok: false, status: 429, local: true, json: function () { return Promise.resolve({}); } });
    countCall('g');
  } else if (settings.sbnUrl && u.indexOf(settings.sbnUrl) === 0) countCall('s');
  return fetch(url, init);
}
function lookupOpts() { return { gbKey: settings.gbKey, sbnUrl: settings.sbnUrl, fetch: apiFetch, lean: !googleLeft(true) }; }
function hasData(b) { return !!(b.t || b.a || b.e || b.y || b.i || b.c != null || b.n); }
function inTab(b) { return !!b.w === (tab === 'wish'); }
function tabBooks() { return state.books.filter(inTab); }
function blankBook(o) {
  var b = Object.assign({ id: newId(), t: '', a: '', e: '', y: '', c: null, i: '', g: [], img: '', nf: false, ts: Date.now(),
    sh: '', n: '', gen: '', pg: '', p: '', pd: '', w: tab === 'wish', rs: '', rt: 0, rd: '', cp: false, ck: '', nb: false, xs: '', xd: '', xa: '', fav: false, fr: '', fl: '', ds: '', dsf: '', dsl: '', dsn: 0 }, o || {});
  if (!b.w && !(o && o.rs != null)) b.rs = 'da';        // un libro appena entrato in libreria e' da leggere
  return b;
}
var FIELDS = ['id', 't', 'a', 'e', 'y', 'c', 'i', 'g', 'img', 'imgL', 'nf', 'ts', 'sh', 'n', 'gen', 'pg', 'p', 'pd', 'w', 'rs', 'rt', 'rd', 'cp', 'ck', 'nb', 'xs', 'xd', 'xa', 'fav', 'fr', 'fl', 'ds', 'dsf', 'dsl', 'dsn'];
function isBusy(b) { var st = (S[b.id] || {}).st; return st === 'queued' || st === 'reading' || st === 'lookup' || st === 'search'; }
function cleanBook(x) {
  if (!x || typeof x !== 'object') return null;
  var img = L.str(x.img);
  return {
    id: String(x.id || '').replace(/[^\w-]/g, '') || newId(),
    t: L.str(x.t), a: L.str(x.a), e: L.str(x.e),
    y: L.str(x.y).replace(/\D/g, '').slice(0, 4),
    c: (typeof x.c === 'number' && isFinite(x.c)) ? x.c : null,
    i: L.str(x.i).replace(/[^\dXx]/g, '').toUpperCase(),
    g: Array.isArray(x.g) ? x.g.filter(function (k) { return ['t', 'a', 'e', 'y', 'i'].indexOf(k) >= 0; }) : [],
    img: /^https:\/\//.test(img) ? img : '',
    imgL: /^https:\/\//.test(L.str(x.imgL)) ? L.str(x.imgL) : '',
    nf: !!x.nf,
    ts: Number(x.ts) || 0,
    sh: L.str(x.sh).slice(0, 80), n: L.str(x.n).slice(0, 2000), gen: L.str(x.gen).slice(0, 80),
    pg: L.str(x.pg).replace(/\D/g, '').slice(0, 5), p: L.str(x.p).slice(0, 80),
    pd: /^\d{4}-\d\d-\d\d$/.test(L.str(x.pd)) ? x.pd : '',
    w: !!x.w,
    rs: ['da', 'in', 'ok'].indexOf(x.rs) >= 0 ? x.rs : '',
    rt: Math.max(0, Math.min(5, parseInt(x.rt, 10) || 0)),
    rd: /^\d{4}-\d\d-\d\d$/.test(L.str(x.rd)) ? x.rd : '',
    cp: !!x.cp,
    ck: /^\d{4}-\d\d-\d\d$/.test(L.str(x.ck)) ? x.ck : '',
    nb: !!x.nb,
    xs: ['v', 'r', 's'].indexOf(x.xs) >= 0 ? x.xs : '',
    xd: /^\d{4}-\d\d-\d\d$/.test(L.str(x.xd)) ? x.xd : '',
    xa: L.str(x.xa).slice(0, 80),
    fav: !!x.fav,                                   // preferito
    fr: L.str(x.fr).slice(0, 30), fl: L.str(x.fl).slice(0, 40),     // ricevuto da (nome) e da quale lista
    ds: L.str(x.ds).slice(0, L.DESC_MAX + 1), dsf: x.dsf === 'g' || x.dsf === 'o' ? x.dsf : '',   // descrizione e fonte (Google, Open Library)
    dsl: /^[a-z]{2}$/.test(L.str(x.dsl)) ? x.dsl : '', dsn: Number(x.dsn) || 0                      // lingua; quando non e' stata trovata
  };
}
function storable() {
  return state.books.filter(hasData).map(function (b) {
    var o = {}; FIELDS.forEach(function (k) { o[k] = k === 'g' ? b.g.slice() : b[k]; }); return o;
  });
}
function persist() {
  var ok = ls.set(LS_KEY, JSON.stringify({ books: storable(), updated: state.updated }));
  var el = $('#sync');
  $('#syncTxt').textContent = ok ? (navigator.onLine === false ? 'Offline · salvato su questo telefono' : 'Salvato su questo telefono') : 'Impossibile salvare: scarica un backup';
  el.classList.toggle('off', !ok || navigator.onLine === false);
  checkBackupNag();
}
function touch() {
  state.updated = Date.now();
  backupReady = null;
  clearTimeout(tSave);
  tSave = setTimeout(persist, 350);
}
function loadAll() {
  try {
    var d = JSON.parse(ls.get(LS_KEY) || '{}');
    state.books = (d.books || []).map(cleanBook).filter(Boolean);
    state.updated = Number(d.updated) || 0;
  } catch (e) {}
  try {
    var s = JSON.parse(ls.get(LS_SET) || '{}');
    settings.gbKey = L.str(s.gbKey); settings.price = s.price !== false; settings.extra = s.extra !== false;
    settings.lastBackup = Number(s.lastBackup) || 0; settings.snooze = Number(s.snooze) || 0;
    settings.view = s.view === 'grid' ? 'grid' : 'list';
    settings.openAll = s.openAll === true;
    settings.sbnUrl = /^https:\/\//.test(L.str(s.sbnUrl)) ? L.str(s.sbnUrl) : '';
    settings.loanSnooze = Number(s.loanSnooze) || 0;
    settings.swiped = s.swiped === true;
    settings.pubFix = s.pubFix === true;
    settings.look = 'nuovo';                       // lo stile «Classico» non c'e' piu': resta solo il nuovo, con palette e caratteri
    // da questa versione il tema chiaro e' il predefinito: chi non aveva scelto «Scuro» passa al chiaro (una volta sola)
    settings.theme = s.themeV2 ? (s.theme === 'dark' || s.theme === 'auto' ? s.theme : 'light') : (s.theme === 'dark' ? 'dark' : 'light');
    settings.themeV2 = true;
    settings.pal = s.palV2 && PALS[s.pal] ? s.pal : 'bosco';   // da questa versione il verde (Bosco) e' la palette principale
    settings.palV2 = true;
    settings.ft = FONTS_T.indexOf(s.ft) >= 0 ? s.ft : 'literata';
    settings.fb = FONTS_B.indexOf(s.fb) >= 0 ? s.fb : 'plex';
    settings.installed = s.installed === true && s.instScope === location.pathname.replace(/[^/]*$/, '');   // installata a questo indirizzo (non a uno vecchio)
    settings.instScope = settings.installed ? s.instScope : '';
    settings.name = L.str(s.name).replace(/\s+/g, ' ').trim().slice(0, 30);
    settings.instSnooze = Number(s.instSnooze) || 0;
  } catch (e) {}
}
function saveSettings() { ls.set(LS_SET, JSON.stringify(settings)); }

/* ---------- avvisi ---------- */
function toast(msg, action) {
  var t = $('#toast');
  $('#toastTxt').textContent = msg;
  var btn = $('#toastBtn');
  btn.hidden = !action;
  btn.onclick = null;
  if (action) { btn.textContent = action.label; btn.onclick = function () { t.hidden = true; action.fn(); }; }
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.hidden = true; }, 6500);
}
var noticeKind = '';
function notice(msg, label, fn, onClose, kind) {
  $('#noticeTxt').textContent = msg;
  var b = $('#noticeBtn');
  b.hidden = !label;
  b.textContent = label || '';
  b.onclick = function () { $('#notice').hidden = true; noticeKind = ''; if (fn) fn(); };
  $('#noticeX').onclick = function () { $('#notice').hidden = true; noticeKind = ''; if (onClose) onClose(); };
  noticeKind = kind || '';
  $('#notice').hidden = false;
}
function beep(ok) {
  try {
    beep.ctx = beep.ctx || new (window.AudioContext || window.webkitAudioContext)();
    var o = beep.ctx.createOscillator(), g = beep.ctx.createGain();
    o.frequency.value = ok ? 880 : 320; g.gain.value = 0.08;
    o.connect(g); g.connect(beep.ctx.destination);
    o.start(); o.stop(beep.ctx.currentTime + 0.09);
  } catch (e) {}
}
function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

/* ---------- lettura di codici a barre ---------- */
var detector = null;
(async function () {
  try {
    if ('BarcodeDetector' in window) {
      var f = await window.BarcodeDetector.getSupportedFormats();
      if (f.indexOf('ean_13') >= 0) detector = new window.BarcodeDetector({ formats: ['ean_13'] });
    }
  } catch (e) {}
})();
var zx = null;
function zxReader() {
  if (zx) return zx;
  var hints = new Map();
  hints.set(window.ZXing.DecodeHintType.POSSIBLE_FORMATS, [window.ZXing.BarcodeFormat.EAN_13]);
  hints.set(window.ZXing.DecodeHintType.TRY_HARDER, true);
  zx = new window.ZXing.MultiFormatReader();
  zx.setHints(hints);
  return zx;
}
function zxDecode(canvas) {
  try {
    var src = new window.ZXing.HTMLCanvasElementLuminanceSource(canvas);
    var bmp = new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(src));
    return L.toIsbn13(zxReader().decode(bmp).getText());
  } catch (e) { return ''; }
}
function scaled(canvas, max) {
  var k = Math.min(1, max / Math.max(canvas.width, canvas.height));
  if (k >= 1) return canvas;
  var c = document.createElement('canvas');
  c.width = Math.round(canvas.width * k); c.height = Math.round(canvas.height * k);
  c.getContext('2d', { willReadFrequently: true }).drawImage(canvas, 0, 0, c.width, c.height);
  return c;
}
async function decodeCanvasBarcode(canvas) {
  if (detector) {
    try {
      var r = await detector.detect(canvas);
      for (var i = 0; i < r.length; i++) { var v = L.toIsbn13(r[i].rawValue); if (v) return v; }
    } catch (e) {}
  }
  var sizes = [2000, 1400, 900];
  for (var j = 0; j < sizes.length; j++) {
    var code = zxDecode(scaled(canvas, sizes[j]));
    if (code) return code;
    await new Promise(function (r2) { setTimeout(r2, 0); });
  }
  // codice piccolo in una foto grande (il retro di un libro): provo a leggere solo una parte della foto, soprattutto la metà bassa
  var tiles = [[0, .5, 1, .5], [0, .66, 1, .34], [0, .5, .6, .5], [.4, .5, .6, .5], [0, 0, 1, .5], [0, .25, 1, .5]];
  for (var ti = 0; ti < tiles.length; ti++) {
    var T = tiles[ti], t = document.createElement('canvas');
    t.width = Math.max(1, Math.round(canvas.width * T[2])); t.height = Math.max(1, Math.round(canvas.height * T[3]));
    t.getContext('2d', { willReadFrequently: true }).drawImage(canvas, canvas.width * T[0], canvas.height * T[1], canvas.width * T[2], canvas.height * T[3], 0, 0, t.width, t.height);
    var c2 = zxDecode(t);
    if (c2) return c2;
    await new Promise(function (r3) { setTimeout(r3, 0); });
  }
  return '';
}

/* ---------- ISBN: aggiunta e ricerca ---------- */
function findByIsbn(code) { return state.books.find(function (b) { return L.toIsbn13(b.i) === code; }); }
/* opts.wish: aggiunge ai Desideri (di default: la scheda aperta). opts.pre: risultato della ricerca gia' pronto.
   Se il libro e' nei Desideri e lo aggiungo alla Libreria, lo sposto (vuol dire che l'ho comprato). */
function addIsbn(code, opts) {
  opts = opts || {};
  var wish = opts.wish != null ? !!opts.wish : tab === 'wish';
  var ex = findByIsbn(code);
  if (ex) {
    if (ex.w && !wish) { ex.w = false; ex.ts = Date.now(); if (!ex.rs) ex.rs = 'da'; touch(); return { moved: ex }; }
    return { dup: ex };
  }
  var b = blankBook({ i: code, w: wish });
  state.books.push(b);
  if (opts.pre) { applyResult(b, opts.pre, code); touch(); return { book: b, done: Promise.resolve() }; }
  S[b.id] = { st: 'queued' };
  touch();
  return { book: b, done: lookupPool(function () { return doLookup(b.id); }) };
}
function applyResult(b, r, code) {
  if (!b.t) b.t = r.t;
  if (!b.a) b.a = r.a;
  if (!b.e) b.e = r.e;
  if (!b.y) b.y = r.y;
  if (!b.gen && r.gen) b.gen = r.gen;
  if (!b.pg && r.pg) b.pg = r.pg;
  if (r.img) b.img = r.img;
  b.i = code; b.nf = false;
  b.g = b.g.filter(function (k) { return ['t', 'a', 'e', 'y', 'i'].indexOf(k) < 0; });
  guessEditor(b);
}
/* Se manca la casa editrice, la deduce dall'ISBN (codice dell'editore). Se la copia dai tuoi libri gia' verificati con lo
   stesso codice, e quei libri hanno tutti lo stesso editore, e' affidabile: niente "da verificare". Se viene dalla
   tabellina generica, o i tuoi libri con quel codice hanno editori diversi, resta "da verificare". */
function guessEditor(b) {
  if (b.e) return false;
  var g = L.guessPublisher(b.i, state.books);
  if (!g) return false;
  b.e = g.name;
  if (g.sure) b.g = b.g.filter(function (k) { return k !== 'e'; });
  else if (b.g.indexOf('e') < 0) b.g.push('e');
  return g.sure ? 'sure' : 'guess';
}
/* Una volta sola: toglie «Da verificare» dalle case editrici gia' dedotte che coincidono con quella dei tuoi libri verificati. */
function confirmLearnedPublishers() {
  if (settings.pubFix) return;
  settings.pubFix = true; saveSettings();
  var done = [];
  state.books.forEach(function (b) {
    if (b.g.length !== 1 || b.g[0] !== 'e' || !b.e || !L.toIsbn13(b.i)) return;
    var g = L.guessPublisher(b.i, state.books);
    if (g && g.sure && L.norm(g.name) === L.norm(b.e)) { b.g = []; done.push(b.id); }
  });
  if (!done.length) return;
  touch();
  setTimeout(function () {
    notice('Ho tolto «Da verificare» da ' + done.length + (done.length === 1 ? ' casa editrice: coincide' : ' case editrici: coincidono') + ' con quella dei tuoi libri già verificati con lo stesso codice editore.',
      'Annulla', function () { done.forEach(function (id) { var x = get(id); if (x && x.g.indexOf('e') < 0) x.g.push('e'); }); renderList(); touch(); updateSummary(); });
  }, 800);
}
async function doLookup(id) {
  var b = get(id);
  if (!b) return;
  var s = S[id] || (S[id] = {});
  var code = L.toIsbn13(b.i);
  if (!code) { delete s.st; refreshRow(id); return; }
  if (navigator.onLine === false) {
    s.st = 'wait'; s.err = 'Senza connessione: lo cerco da solo appena torna la rete.'; s.retry = 'lookup';
    refreshRow(id); updateSummary();
    if (!offlineNoted) { offlineNoted = true; toast('Sei offline: i libri restano salvati con l\'ISBN e li cerco da soli appena torna la rete.'); }
    return;
  }
  s.st = 'lookup';
  refreshRow(id);
  try {
    var r = await L.lookupIsbn(code, lookupOpts());
    b = get(id);
    if (!b) return;
    clearTimeout(s.timer); delete s.tries;
    b.ck = today();
    if (r) {
      applyResult(b, r, code);
      delete s.st;
      coverPool(function () { return probeCover(id); });
    } else {
      b.nf = true;
      guessEditor(b);
      delete s.st;
    }
    touch();
  } catch (e) {
    b = get(id);
    if (!b) return;
    if (e && (e.code === 'network' || e.code === 'rate')) {
      // rete debole o limite di Google: riprovo da solo, sempre piu' di rado
      s.tries = (s.tries || 0) + 1;
      var rate = e.code === 'rate', waits = rate ? [90, 180, 300, 600] : [20, 60, 180, 600];
      var sec = waits[Math.min(s.tries - 1, waits.length - 1)];
      var when = sec < 60 ? sec + ' secondi' : sec === 90 ? 'un minuto e mezzo' : Math.round(sec / 60) + (sec === 60 ? ' minuto' : ' minuti');
      s.retry = 'lookup';
      if (rate && s.tries > waits.length) {
        s.st = 'error';
        s.err = settings.gbKey ? 'Google Libri ha raggiunto il limite di richieste della tua chiave. Riprova più tardi.'
          : 'Google Libri rifiuta le richieste senza chiave (limite raggiunto). Soluzione stabile: inserisci la tua chiave gratuita in Menu › Opzioni › Ricerca dei libri. Intanto puoi premere Riprova.';
      } else {
        s.st = 'wait';
        s.err = (rate ? (settings.gbKey && !googleLeft(false) ? 'Ricerche di oggi su Google quasi finite (' + quota.g + ' su 1.000): riprovo con le altre banche dati tra ' + when + ' (Google riparte verso le 9 del mattino)' : 'Google Libri è al limite di richieste' + (settings.gbKey ? '' : ' (senza chiave)')) : (navigator.onLine === false ? 'Senza connessione' : 'Connessione debole')) + (rate && settings.gbKey && !googleLeft(false) ? '.' : ': riprovo da solo tra ' + when + '.');
        clearTimeout(s.timer);
        s.timer = setTimeout(function () { var x = S[id]; if (x && x.st === 'wait' && get(id)) { x.st = 'queued'; refreshRow(id); lookupPool(function () { return doLookup(id); }); } }, sec * 1000);
      }
    }
    else { delete s.st; }
  }
  refreshRow(id);
  updateSummary();
}
function todoRows() {
  return state.books.filter(function (b) { return !b.t && !b.nf && L.toIsbn13(b.i) && !isBusy(b); });
}
function runTodo() {
  if (navigator.onLine === false) { toast('Sei offline. Riprova quando c\'è connessione.'); return; }
  todoRows().forEach(function (b) {
    S[b.id] = Object.assign(S[b.id] || {}, { st: 'queued' });
    lookupPool(function () { return doLookup(b.id); });
    refreshRow(b.id);
  });
  updateSummary();
}

/* ---------- foto: codice a barre oppure copertina ---------- */
async function loadCanvas(file, max) {
  var bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch (e) { bmp = await createImageBitmap(file); }
  var k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  var c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
  c.getContext('2d', { willReadFrequently: true }).drawImage(bmp, 0, 0, c.width, c.height);
  if (bmp.close) bmp.close();
  return c;
}
function thumbOf(canvas) {
  var k = Math.min(1, 140 / Math.max(canvas.width, canvas.height));
  var t = document.createElement('canvas');
  t.width = Math.max(1, Math.round(canvas.width * k)); t.height = Math.max(1, Math.round(canvas.height * k));
  t.getContext('2d').drawImage(canvas, 0, 0, t.width, t.height);
  return t.toDataURL('image/jpeg', 0.7);
}
var ocrP = null;
function getOcr(onMsg) {
  if (ocrP) return ocrP;
  ocrP = (async function () {
    if (!window.Tesseract) throw { code: 'ocr' };
    var abs = function (p) { return new URL(p, location.href).href; };
    var w = await window.Tesseract.createWorker(['ita', 'eng'], 1, {
      workerPath: abs('vendor/worker.min.js'),
      corePath: abs('vendor/core'),
      langPath: abs('vendor/lang'),
      logger: function (m) { if (onMsg && m && m.status === 'recognizing text') onMsg(Math.round((m.progress || 0) * 100)); }
    });
    await w.setParameters({ tessedit_pageseg_mode: String(window.Tesseract.PSM.SPARSE_TEXT), preserve_interword_spaces: '1' });
    return w;
  })();
  ocrP.catch(function () { ocrP = null; });
  return ocrP;
}
function setStatusText(id, txt) {
  var el = rowEl(id);
  var span = el && el.querySelector('.status .txt');
  if (span) span.textContent = txt;
}
function capFirst(s) { s = s.toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }
function niceCase(s, words) {
  if (s !== s.toUpperCase()) return s;
  return words ? s.toLowerCase().replace(/(^|[\s'’-])(\S)/g, function (m, a, c) { return a + c.toUpperCase(); }) : capFirst(s);
}
var sameAs = {};                                  // foto di un libro gia' in elenco -> id del libro esistente
function fromIsbn(id, code, price) {
  var b = get(id), s = S[id];
  if (!b) return;
  var ex = findByIsbn(code);
  if (ex && ex.id !== id) {
    sameAs[id] = ex.id;
    state.books = state.books.filter(function (x) { return x.id !== id; });
    delete S[id];
    refreshRow(id); touch(); updateSummary();
    toast('Già in elenco: ' + (ex.t || code));
    return;
  }
  b.i = code;
  if (price != null && b.c == null) b.c = price;
  s.st = 'lookup';
  touch();
  refreshRow(id);
  return lookupPool(function () { return doLookup(id); });
}
function applyCandidate(id, c) {
  var b = get(id), s = S[id];
  if (!b) return;
  b.t = c.t; b.a = c.a; b.e = c.e; b.y = c.y;
  if (c.gen && !b.gen) b.gen = c.gen;
  if (c.pg && !b.pg) b.pg = c.pg;
  if (c.i && !findByIsbn(c.i)) b.i = c.i;
  if (c.img) b.img = c.img;
  if (!b.img && s.big && !coverURL[id]) saveCoverData(id, s.big);
  b.g = ['e', 'y', 'i'].filter(function (k) { return b[k]; });
  if (s.price != null && b.c == null) b.c = s.price;
  b.nf = false;
  ['st', 'cands', 'lines', 'price', 'err', 'retry'].forEach(function (k) { delete s[k]; });
  touch(); refreshRow(id); updateSummary();
}
function applyOcrText(id) {
  var b = get(id), s = S[id];
  if (!b) return;
  var ta = L.splitTitleAuthor(s.lines || []);
  if (ta.t) { b.t = niceCase(ta.t, false); b.g.push('t'); }
  if (s.big && !b.img && !coverURL[id]) saveCoverData(id, s.big);
  if (ta.a) { b.a = niceCase(ta.a, true); b.g.push('a'); }
  if (s.price != null && b.c == null) b.c = s.price;
  ['st', 'cands', 'lines', 'price', 'err', 'retry'].forEach(function (k) { delete s[k]; });
  if (!hasData(b)) { s.st = 'error'; s.err = 'Non ho letto nulla di utile. Scrivi i dati a mano o prova con il codice a barre.'; }
  touch(); refreshRow(id); updateSummary();
}
/* Lettori leggeri solo per il prezzo: lingua inglese (cifre e «€» bastano) e solo i caratteri di un prezzo, si avviano
   in fretta e si preparano in anticipo. Due in parallelo sui telefoni con piu' processori: a ogni giro ciascuno legge
   una versione diversa della stessa immagine, e il primo che trova un prezzo con «€» chiude la lettura. */
var priceOcrP = null, PRICE_CHARS = '0123456789.,€EeUuRrOo ';
function getPriceOcr() {
  if (priceOcrP) return priceOcrP;
  priceOcrP = (async function () {
    if (!window.Tesseract) throw { code: 'ocr' };
    var abs = function (p) { return new URL(p, location.href).href; };
    var n = (navigator.hardwareConcurrency || 2) >= 4 ? 2 : 1;
    return Promise.all(Array.apply(null, Array(n)).map(async function () {
      var w = await window.Tesseract.createWorker('eng', 1, { workerPath: abs('vendor/worker.min.js'), corePath: abs('vendor/core'), langPath: abs('vendor/lang') });
      await w.setParameters({ tessedit_pageseg_mode: String(window.Tesseract.PSM.SPARSE_TEXT) });
      w._chars = ''; w._chain = Promise.resolve();
      return w;
    }));
  })();
  priceOcrP.catch(function () { priceOcrP = null; });
  return priceOcrP;
}
/* Una lettura su un lettore, con i suoi caratteri ammessi ('' = tutti): i lavori sullo stesso lettore vanno in fila,
   cosi' prezzo e ISBN scritto non si scambiano le impostazioni. Restituisce solo il testo (piu' veloce). */
function ocrText(w, chars, img) {
  var job = w._chain.then(async function () {
    if (w._chars !== chars) { await w.setParameters({ tessedit_char_whitelist: chars }); w._chars = chars; }
    var o = await w.recognize(img, {}, { text: true, blocks: false, hocr: false, tsv: false });
    return (o.data || {}).text || '';
  });
  w._chain = job.catch(function () {});
  return job;
}
function warmPriceOcr() { setTimeout(function () { getPriceOcr().catch(function () {}); }, 300); }
/* Immagine ripulita per l'OCR: grigi, luce uniformata (divisa per lo sfondo locale), testo scuro su fondo chiaro, contrasto pieno */
function prepPrice(src, k) {
  var w = Math.max(1, Math.round(src.width * k)), h = Math.max(1, Math.round(src.height * k));
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0, w, h);
  var id = x.getImageData(0, 0, w, h), d = id.data, n = w * h, g = new Float32Array(n), i, j;
  for (i = 0, j = 0; i < n; i++, j += 4) g[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
  var hist = new Uint32Array(256), acc = 0, med = 0;
  for (i = 0; i < n; i++) hist[g[i] | 0]++;
  for (i = 0; i < 256; i++) { acc += hist[i]; if (acc >= n / 2) { med = i; break; } }
  if (med < 128) for (i = 0; i < n; i++) g[i] = 255 - g[i];                 // fondo scuro: testo chiaro -> lo rendo scuro
  var r = Math.max(8, Math.round(Math.min(w, h) / 6)), W1 = w + 1, I = new Float64Array(W1 * (h + 1)), out = new Float32Array(n), yy, xx;
  for (yy = 0; yy < h; yy++) { var row = 0; for (xx = 0; xx < w; xx++) { row += g[yy * w + xx]; I[(yy + 1) * W1 + xx + 1] = I[yy * W1 + xx + 1] + row; } }
  for (yy = 0; yy < h; yy++) {
    var y0 = Math.max(0, yy - r), y1 = Math.min(h, yy + r + 1);
    for (xx = 0; xx < w; xx++) {
      var x0 = Math.max(0, xx - r), x1 = Math.min(w, xx + r + 1);
      var bg = (I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0]) / ((y1 - y0) * (x1 - x0));
      out[yy * w + xx] = Math.min(255, g[yy * w + xx] / Math.max(1, bg) * 212);
    }
  }
  var hs = new Uint32Array(256), lo = 0, hi = 255;
  for (i = 0; i < n; i++) hs[out[i] | 0]++;
  for (i = 0, acc = 0; i < 256; i++) { acc += hs[i]; if (acc >= n * 0.01) { lo = i; break; } }
  for (i = 255, acc = 0; i >= 0; i--) { acc += hs[i]; if (acc >= n * 0.01) { hi = i; break; } }
  var span = Math.max(1, hi - lo);
  for (i = 0, j = 0; i < n; i++, j += 4) { var v = (out[i] - lo) * 255 / span; v = v < 0 ? 0 : v > 255 ? 255 : v; d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = 255; }
  x.putImageData(id, 0, 0);
  return c;
}
function scaledBy(src, k) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(src.width * k)); c.height = Math.max(1, Math.round(src.height * k)); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height); return c; }
function rotated(src, dir) { var c = document.createElement('canvas'); c.width = src.height; c.height = src.width; var x = c.getContext('2d'); x.translate(dir > 0 ? c.width : 0, dir > 0 ? 0 : c.height); x.rotate(dir * Math.PI / 2); x.drawImage(src, 0, 0); return c; }
/* Legge il prezzo: 1) immagine ripulita e originale, 2) le stesse girate (prezzi stampati in verticale accanto al codice a barre).
   Restituisce { v, sure } (sure: c'era il simbolo €) oppure null. rounds: quanti giri al massimo. */
async function readPrice(base, rounds) {
  var workers = await getPriceOcr();
  var k = Math.min(2.5, Math.max(1, 900 / base.width));
  if (base.width * k > 1400) k = 1400 / base.width;
  if (base.height * k > 1400) k = Math.min(k, 1400 / base.height);
  var pre = prepPrice(base, k), raw = scaledBy(base, k);
  var plan = [[pre, raw], [rotated(pre, -1), rotated(pre, 1)], [rotated(raw, -1), rotated(raw, 1)]].slice(0, rounds || 3), weak = null;
  for (var r = 0; r < plan.length; r++) {
    var got = await new Promise(function (done) {
      var list = plan[r], res = [], left = list.length, fin = false;
      list.forEach(function (cv, i) {
        ocrText(workers[i % workers.length], PRICE_CHARS, cv)
          .then(function (text) { return L.findPrice(text); }, function () { return null; })
          .then(function (g) { res[i] = g; left--; if (!fin && ((g && g.sure) || left === 0)) { fin = true; done(res.slice()); } });
      });
    });
    for (var q = 0; q < got.length; q++) if (got[q] && got[q].sure) return got[q];
    for (q = 0; q < got.length; q++) if (got[q] && !weak) weak = got[q];
  }
  return weak;
}
async function readPriceFromCanvas(canvas, rounds) { var r = await readPrice(canvas, rounds); return r ? r.v : null; }
async function processPhoto(id, file) {
  var b = get(id);
  if (!b) return;
  var s = S[id];
  s.st = 'reading'; s.msg = 'Leggo la foto…';
  refreshRow(id);
  try {
    var canvas = await loadCanvas(file, 2000);
    if (!get(id)) return;
    s.thumb = thumbOf(canvas);
    try { s.big = scaled(canvas, 1200).toDataURL('image/jpeg', 0.85); } catch (e) { s.big = ''; }
    s.file = null;
    syncThumbs(); refreshRow(id);
    var code = await decodeCanvasBarcode(canvas);
    if (!get(id)) return;
    if (code) { await fromIsbn(id, code); return; }

    s.msg = 'Preparo il riconoscimento del testo (solo la prima volta)…'; setStatusText(id, s.msg);
    var worker = await getOcr(function (p) { setStatusText(id, 'Leggo il testo… ' + p + '%'); });
    setStatusText(id, 'Leggo il testo…');
    var res = await worker.recognize(canvas);
    var data = res.data || {};
    if (!get(id)) return;
    var lines = L.ocrLines(data);
    var price = L.extractPrice(data.text || '');
    var written = L.extractIsbns(data.text || '');
    if (!written.length) written = L.ocrIsbns(data.text || '', true);
    if (written.length) { await fromIsbn(id, written[0], price); return; }
    var qs = L.buildQueries(lines);
    s.lines = lines; s.price = price;
    if (!qs.length) { s.st = 'error'; s.err = 'Non riesco a leggere il testo. Avvicina la copertina, con luce uniforme, oppure inquadra il codice a barre.'; s.retry = null; refreshRow(id); return; }
    s.st = 'search'; refreshRow(id);
    var out = await Promise.allSettled(qs.map(function (qq) { return L.searchText(qq, lookupOpts()); }));
    if (!get(id)) return;
    var all = [], seen = {};
    out.forEach(function (r) {
      if (r.status === 'fulfilled') r.value.forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; all.push(c); } });
    });
    if (out.every(function (r) { return r.status === 'rejected'; })) {
      s.st = 'error'; s.err = 'Ho letto il testo, ma le banche dati non rispondono. Controlla la connessione.'; s.retry = 'text';
      refreshRow(id); return;
    }
    var ranked = L.rankCandidates(all, lines);
    if (!ranked.length) { applyOcrText(id); toast('Nessun libro trovato online: ho usato il testo letto, controllalo.'); return; }
    if (L.strongMatch(ranked)) { applyCandidate(id, ranked[0]); return; }
    s.st = 'choose'; s.cands = ranked.slice(0, 6);
    refreshRow(id); updateSummary();
  } catch (e) {
    if (!get(id)) return;
    s.st = 'error';
    s.err = (e && e.code === 'ocr') ? 'Il riconoscimento del testo non è disponibile. Usa il codice a barre o scrivi i dati.' : 'Lettura non riuscita. Riprova con un\'altra foto.';
    s.retry = null;
    refreshRow(id);
  }
}
function addPhotos(files, ask) {
  var list = Array.prototype.slice.call(files || []).filter(function (f) { return !f.type || f.type.indexOf('image/') === 0; }).slice(0, 60);
  if (!list.length) return;
  q = ''; flt = ''; $('#q').value = ''; setView('list');
  var last = null;
  list.forEach(function (f) {
    var id = newId();
    state.books.push(blankBook({ id: id }));
    S[id] = { st: 'queued', file: f };
    photoPool(function () { return processPhoto(id, f); });
    last = id;
  });
  renderList(); updateSummary();
  if (ask && settings.price && list.length === 1) askPrice(last);
}
/* Seconda foto, facoltativa: il prezzo. La chiedo subito, senza aspettare che il libro sia riconosciuto. */
var askId = null;
function askPrice(id) {
  askId = id;
  warmPriceOcr();
  $('#priceAskIn').value = ''; $('#priceAskErr').hidden = true;
  $('#priceAsk').hidden = false;
}
$('#priceAskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var v = L.parseNum($('#priceAskIn').value);
  if (!(v > 0 && v < 1000)) { $('#priceAskErr').hidden = false; $('#priceAskIn').focus(); return; }
  var id = askId, b = bookFor(id);
  $('#priceAsk').hidden = true; askId = null; $('#priceAskIn').blur();
  v = Math.round(v * 100) / 100;
  if (b) { b.c = v; touch(); refreshRow(b.id); updateSummary(); }
  else if (S[id]) S[id].price = v;
  toast('Prezzo: ' + eur(v) + '.');
});
function bookFor(id) { return get(id) || (sameAs[id] && get(sameAs[id])) || null; }

/* ---------- scansione dal vivo ---------- */
var stream = null, scanTimer = null, scanCtx = { count: 0, added: 0, last: '', lastAt: 0 }, torchOn = false, liveCanvas = null, pushed = false;
var scanMode = 'add';                         // 'add': aggiunge; 'check': «Ce l'ho già?», controlla soltanto
var priceTarget = null, scanPaused = false;   // libro appena scansionato a cui dare il prezzo
function priceBar(txt, btnLabel, busy) {
  if (typingPrice) closePriceType();
  $('#scanPriceTxt').textContent = txt;
  var b = $('#scanPriceBtn');
  b.innerHTML = icon('euro') + (btnLabel || 'Leggi il prezzo');
  b.disabled = !!busy;
  $('#scanPrice').hidden = false;
}
/* Ritaglia dal video la zona del riquadro (un po' allargata), tenendo conto di come il video riempie lo schermo. */
function guideCanvas(full) {
  var v = $('#scanVideo'), vw = v.videoWidth, vh = v.videoHeight;
  if (!vw || !vh) return null;
  var x = 0, y = 0, w = vw, h = vh;
  if (!full) {
    try {
      var r = v.getBoundingClientRect(), g = $('#scanGuide').getBoundingClientRect();
      var sc = Math.max(r.width / vw, r.height / vh), ox = (r.width - vw * sc) / 2, oy = (r.height - vh * sc) / 2;
      var gw = g.width / sc, gh = g.height / sc;
      x = (g.left - r.left - ox) / sc - gw * 0.15; y = (g.top - r.top - oy) / sc - gh * 0.25; w = gw * 1.3; h = gh * 1.5;
      x = Math.max(0, x); y = Math.max(0, y); w = Math.min(vw - x, w); h = Math.min(vh - y, h);
      if (!(w > 40 && h > 20)) throw 0;
    } catch (e) { x = vw * 0.08; y = vh * 0.3; w = vw * 0.84; h = vh * 0.4; }
  }
  var k = Math.min(2.5, Math.max(1, 900 / w));
  if (w * k > 1280) k = 1280 / w;
  if (h * k > 1280) k = Math.min(k, 1280 / h);
  var c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  c.getContext('2d').drawImage(v, x, y, w, h, 0, 0, c.width, c.height);
  return c;
}
/* Prezzo scritto a mano: piu' veloce quando la fotocamera fatica. Intanto la scansione si ferma, cosi' il libro
   successivo non arriva mentre scrivi. */
var typingPrice = false, priceTxtBefore = '';
function openPriceType() {
  var b = priceTarget && get(priceTarget), inp = $('#scanPriceIn');
  if (!b || !scanning) { inp.blur(); return; }
  if (typingPrice) return;
  typingPrice = true; scanPaused = true;
  priceTxtBefore = $('#scanPriceTxt').textContent;
  $('#scanPriceTxt').textContent = 'Scrivi il prezzo' + (b.t ? ' di «' + b.t + '»' : '') + ' e tocca OK.';
  $('#scanPrice').classList.add('typing');
  inp.placeholder = 'es. 14,50'; inp.classList.remove('bad');
  if (!inp.value && b.c != null) inp.value = String(b.c.toFixed(2)).replace('.', ',');
  if (document.activeElement !== inp) { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }
}
function closePriceType() {
  if (!typingPrice) return;
  typingPrice = false; scanPaused = false;
  if (priceTxtBefore) $('#scanPriceTxt').textContent = priceTxtBefore;
  $('#scanPrice').classList.remove('typing');
  var inp = $('#scanPriceIn'); inp.value = ''; inp.placeholder = 'Scrivi'; inp.classList.remove('bad');
  try { inp.blur(); } catch (e) {}
}
function savePriceType(e) {
  if (e) e.preventDefault();
  var inp = $('#scanPriceIn'), v = L.parseNum(inp.value), b = priceTarget && get(priceTarget);
  if (!(v > 0 && v < 1000)) { inp.classList.add('bad'); inp.focus(); return; }
  closePriceType();
  if (!b) return;
  b.c = Math.round(v * 100) / 100; touch();
  beep(true); vibrate(40);
  priceBar('✓ ' + eur(b.c) + (b.t ? ' · ' + b.t : '') + '. Inquadra il prossimo codice a barre.', 'Rileggi');
}
$('#scanPriceIn').addEventListener('focus', openPriceType);              // il tocco sul campo apre la tastiera e ferma la scansione
$('#scanPriceForm').addEventListener('submit', savePriceType);
$('#scanPriceCancel').addEventListener('click', closePriceType);
$('#scanPriceIn').addEventListener('input', function (e) { e.target.classList.remove('bad'); });
async function readLivePrice() {
  var id = priceTarget, b = id && get(id);
  if (!b || scanPaused) return;
  scanPaused = true;
  priceBar('Leggo il prezzo…', 'Leggo…', true);
  var got = null;
  try {
    var c = guideCanvas(false);
    got = c ? await readPrice(c, 3) : null;
    if (!got && scanning && priceTarget === id) { c = guideCanvas(true); got = c ? await readPrice(c, 1) : null; }   // prezzo fuori dal riquadro
  } catch (e) { got = null; }
  var pr = got ? got.v : null;
  scanPaused = false;
  if (!scanning) return;
  b = get(id);
  if (!b || priceTarget !== id) return;
  if (pr == null) { beep(false); priceBar('Non trovo il prezzo. Avvicinati al «€» stampato e riprova, oppure tocca «Scrivi». O passa al libro successivo.', 'Riprova'); return; }
  b.c = pr; touch();
  beep(true); vibrate(40);
  priceBar('✓ ' + eur(pr) + (b.t ? ' · ' + b.t : '') + (got.sure ? '. Inquadra il prossimo codice a barre.' : '. Controllalo: non ho visto il simbolo €. Se è sbagliato scrivilo qui.'), 'Rileggi');
}
/* contatore in alto e pulsante di uscita in basso, che dice cosa succede uscendo */
function setScanCount(t) {
  $('#scanCount').textContent = t;
  var n = scanCtx.count;
  $('#scanDone').textContent = scanMode === 'check' ? 'Chiudi la fotocamera' : n ? 'Ho finito · vedi ' + (n === 1 ? 'il libro aggiunto' : 'i ' + n + ' libri aggiunti') : 'Chiudi la fotocamera';
  $('#scanDone').classList.toggle('has', scanMode !== 'check' && n > 0);
}
function scanMsg(t) { $('#scanMsg').textContent = t; }

/* Tre modi di inquadrare: codice a barre (sempre attivo), numero ISBN stampato (letto di continuo con l'OCR leggero),
   copertina (si scatta; poi la riconosce come una Foto, mentre continui). In «Ce l'ho già?» niente copertina. */
var scanKind = 'bar', textTimer = null, textBusy = false, textSince = 0, textHinted = false, shootBusy = false;
function kindMsg() {
  var check = scanMode === 'check', wish = tab === 'wish';
  if (scanKind === 'text') return check ? 'Inquadra il numero ISBN stampato (sul retro o nella pagina del copyright) dentro la striscia: ti dico se ce l\'hai.'
    : 'Inquadra il numero ISBN stampato dentro la striscia: di solito è sul retro o nella pagina del copyright, dopo la parola «ISBN». Lo leggo da solo.';
  if (scanKind === 'cover') return 'Inquadra tutta la copertina nel riquadro e tocca il pulsante bianco. La riconosco mentre passi alla prossima' + (wish ? ' (va nei Desideri).' : '.');
  if (check) return 'Inquadra il codice a barre: ti dico se il libro è già in libreria. Non aggiungo niente da solo.';
  return wish ? 'Inquadra il codice a barre: ogni libro finisce nella lista dei Desideri.' : 'Inquadra il codice a barre, di solito sul retro. Ogni libro viene aggiunto da solo.';
}
function setScanKind(k) {
  if (k !== 'text' && k !== 'cover') k = 'bar';
  if (scanMode === 'check' && k === 'cover') k = 'bar';
  scanKind = k;
  var sc = $('#scan');
  sc.classList.toggle('k-text', k === 'text'); sc.classList.toggle('k-cover', k === 'cover');
  Array.prototype.forEach.call($('#scanKinds').querySelectorAll('[data-k]'), function (b) { b.setAttribute('aria-checked', b.dataset.k === k ? 'true' : 'false'); });
  $('#scanShootBox').hidden = k !== 'cover';
  clearTimeout(textTimer);
  $('#scanGuide').classList.remove('reading');
  scanMsg(kindMsg());
  if (k === 'text') {
    textSince = Date.now(); textHinted = false;
    var ready = false;
    getPriceOcr().then(function () { ready = true; }, function () { if (scanning && scanKind === 'text') scanMsg('La lettura del testo non è disponibile: usa il codice a barre o Digita.'); });
    setTimeout(function () { if (!ready && scanning && scanKind === 'text') scanMsg('Preparo la lettura del testo (solo la prima volta)…'); }, 400);
    textTimer = setTimeout(textTick, 300);
  }
}
async function readLiveIsbn() {
  var c = guideCanvas(false);
  if (!c) return '';
  var ws = await getPriceOcr();
  return L.ocrIsbns(await ocrText(ws[0], '', c), true)[0] || '';
}
function textTick() {
  clearTimeout(textTimer);
  if (!scanning || scanKind !== 'text') return;
  if (textBusy || scanPaused || !$('#scanVideo').videoWidth) { textTimer = setTimeout(textTick, 250); return; }
  textBusy = true;
  $('#scanGuide').classList.add('reading');
  readLiveIsbn().catch(function () { return ''; }).then(function (code) {
    textBusy = false;
    $('#scanGuide').classList.remove('reading');
    if (!scanning || scanKind !== 'text') return;
    if (code) { textSince = Date.now(); textHinted = false; onScanned(code); }
    else if (!textHinted && Date.now() - textSince > 12000) {
      textHinted = true;
      scanMsg('Non leggo ancora un ISBN valido: avvicinati finché il numero riempie la striscia, tieni fermo il telefono' + ($('#scanTorch').hidden ? '' : ' e, se c\'è poca luce, accendi la torcia') + '.');
    }
    textTimer = setTimeout(textTick, 350);
  });
}
/* Ritaglio della copertina: il riquadro con un piccolo margine, lato lungo fino a 2000 punti. */
function coverCanvas() {
  var v = $('#scanVideo'), vw = v.videoWidth, vh = v.videoHeight;
  if (!vw || !vh) return null;
  var x = 0, y = 0, w = vw, h = vh;
  try {
    var r = v.getBoundingClientRect(), g = $('#scanGuide').getBoundingClientRect();
    var sc = Math.max(r.width / vw, r.height / vh), ox = (r.width - vw * sc) / 2, oy = (r.height - vh * sc) / 2;
    var gw = g.width / sc, gh = g.height / sc;
    x = (g.left - r.left - ox) / sc - gw * 0.06; y = (g.top - r.top - oy) / sc - gh * 0.06; w = gw * 1.12; h = gh * 1.12;
    x = Math.max(0, x); y = Math.max(0, y); w = Math.min(vw - x, w); h = Math.min(vh - y, h);
    if (!(w > 80 && h > 80)) throw 0;
  } catch (e) { x = 0; y = 0; w = vw; h = vh; }
  var k = Math.min(1, 2000 / Math.max(w, h));
  var c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  c.getContext('2d').drawImage(v, x, y, w, h, 0, 0, c.width, c.height);
  return c;
}
async function shootCover() {
  if (!scanning || shootBusy || scanMode === 'check') return;
  var c = coverCanvas();
  if (!c) return;
  shootBusy = true; $('#scanShoot').disabled = true;
  var sc = $('#scan');
  sc.classList.add('flash'); setTimeout(function () { sc.classList.remove('flash'); }, 140);
  beep(true); vibrate(40);
  var blob = null;
  try { blob = await new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.9); }); } catch (e) {}
  shootBusy = false; $('#scanShoot').disabled = false;
  if (!blob || !scanning) return;
  var id = newId();
  state.books.push(blankBook({ id: id }));
  S[id] = { st: 'queued', file: blob };
  photoPool(function () { return processPhoto(id, blob); });
  touch();
  scanCtx.count++; scanCtx.added++;
  setScanCount(scanCtx.count + (scanCtx.count === 1 ? ' aggiunto' : ' aggiunti'));
  $('#scanRes').hidden = true; resCode = '';
  scanMsg('Copertina presa: la riconosco mentre continui. Se ci sono più libri possibili, alla fine scegli tu dall\'elenco.');
  if (settings.price) { priceTarget = id; priceBar('Prezzo? Inquadra il prezzo stampato e tocca «Leggi il prezzo», oppure «Scrivi». Se non ti serve, passa alla prossima copertina.'); }
  else { $('#scanPrice').hidden = true; priceTarget = null; }
}
$('#scanKinds').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b && scanning) setScanKind(b.dataset.k); });
$('#scanShoot').addEventListener('click', shootCover);
async function startScan(mode) {
  scanMode = mode === 'check' ? 'check' : 'add';
  try { beep.ctx = beep.ctx || new (window.AudioContext || window.webkitAudioContext)(); if (beep.ctx.resume) beep.ctx.resume(); } catch (e) {}
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    notice('La fotocamera non è disponibile in questo browser. Usa Foto o Digita.');
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
  } catch (e) {
    notice('Non posso usare la fotocamera. Consenti l\'accesso nelle impostazioni del sito, oppure usa Foto o Digita.');
    return;
  }
  var v = $('#scanVideo');
  v.srcObject = stream;
  try { await v.play(); } catch (e) {}
  var track = stream.getVideoTracks()[0];
  try {
    var caps = track.getCapabilities ? track.getCapabilities() : {};
    $('#scanTorch').hidden = !caps.torch;
    if (caps.focusMode && caps.focusMode.indexOf('continuous') >= 0) track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(function () {});
  } catch (e) {}
  scanCtx = { count: 0, added: 0, last: '', lastAt: 0 };
  setScanCount(scanMode === 'check' ? 'Ce l\'ho già?' : '0 aggiunti');
  $('#scanRes').hidden = true; $('#scanRes').innerHTML = ''; resCode = ''; resKind = '';
  $('#scanPrice').hidden = true; priceTarget = null; scanPaused = false;
  if (scanMode === 'add' && settings.price) warmPriceOcr();
  $('#scan').classList.toggle('checking', scanMode === 'check');
  $('#scan').hidden = false;
  scanning = true;
  setScanKind(scanKind);
  try { history.pushState({ scan: 1 }, ''); pushed = true; } catch (e) {}
  scanTick();
}
function stopScan(fromPop) {
  if (!scanning) return;
  closePriceType();
  scanning = false;
  clearTimeout(scanTimer); clearTimeout(textTimer);
  if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
  $('#scanVideo').srcObject = null;
  $('#scan').hidden = true;
  torchOn = false;
  if (pushed && !fromPop) { try { history.back(); } catch (e) {} }
  pushed = false;
  renderList(); updateSummary();
  if (scanCtx.added) toast(scanCtx.added === 1 ? 'Aggiunto 1 libro.' : 'Aggiunti ' + scanCtx.added + ' libri.');
  else if (scanMode === 'check' && scanCtx.count) toast('Controllati ' + scanCtx.count + (scanCtx.count === 1 ? ' libro.' : ' libri.'));
}
async function scanTick() {
  if (!scanning) return;
  if (scanPaused) { scanTimer = setTimeout(scanTick, 200); return; }
  var v = $('#scanVideo');
  try {
    if (v.videoWidth) {
      var code = '';
      if (detector) {
        var r = await detector.detect(v);
        for (var i = 0; i < r.length; i++) { code = L.toIsbn13(r[i].rawValue); if (code) break; }
      }
      if (!code) {
        liveCanvas = liveCanvas || document.createElement('canvas');
        var k = Math.min(1, 1280 / v.videoWidth);
        liveCanvas.width = Math.round(v.videoWidth * k); liveCanvas.height = Math.round(v.videoHeight * k);
        liveCanvas.getContext('2d', { willReadFrequently: true }).drawImage(v, 0, 0, liveCanvas.width, liveCanvas.height);
        code = zxDecode(liveCanvas);
      }
      if (code && scanning) onScanned(code);
    }
  } catch (e) {}
  if (scanning) scanTimer = setTimeout(scanTick, 130);
}
function onScanned(code) {
  /* Mentre si legge il prezzo il codice a barre (o l'ISBN scritto) dello stesso libro e' spesso li' accanto:
     lo ignoro in silenzio, niente «Già in elenco». Un codice diverso invece e' il libro successivo. */
  if (scanMode === 'add' && priceTarget) {
    var pt = get(priceTarget);
    if (pt && L.toIsbn13(pt.i) === code) {
      if (pt.c == null && !scanPaused) scanMsg('È lo stesso libro: per il prezzo inquadra il «€» e tocca «Leggi il prezzo», oppure «Scrivi». Per andare avanti, inquadra il prossimo codice.');
      return;
    }
  }
  var now = Date.now();
  if (code === scanCtx.last && now - scanCtx.lastAt < 5000) { scanCtx.lastAt = now; return; }
  scanCtx.last = code; scanCtx.lastAt = now;
  var g = $('#scanGuide');
  g.classList.add('hit'); setTimeout(function () { g.classList.remove('hit'); }, 350);
  if (scanMode === 'check') { onCheck(code); return; }
  var res = addIsbn(code);
  if (!res.dup) { $('#scanRes').hidden = true; resCode = ''; }
  if (res.moved) {
    if (settings.price && res.moved.c == null) { priceTarget = res.moved.id; priceBar('Prezzo? Inquadra il prezzo stampato e tocca «Leggi il prezzo», oppure «Scrivi».'); }
    beep(true); vibrate(50);
    scanCtx.count++; scanCtx.added++;
    setScanCount(scanCtx.count + (scanCtx.count === 1 ? ' aggiunto' : ' aggiunti'));
    scanMsg('Era nei Desideri: spostato in Libreria. ' + (res.moved.t || code));
    return;
  }
  if (res.dup) {
    if (res.dup.id !== priceTarget) { $('#scanPrice').hidden = true; priceTarget = null; }
    beep(false); vibrate(120);
    scanMsg((res.dup.w ? 'Già nei Desideri: ' : (tab === 'wish' ? 'Ce l\'hai già in Libreria: ' : 'Già in elenco: ')) + (res.dup.t || code) + (res.dup.xs ? ' (' + goneText(res.dup).toLowerCase() + ')' : ''));
    if (!res.dup.w && tab === 'lib' && res.dup.xs && !state.books.some(function (x) { return !x.w && !x.xs && L.toIsbn13(x.i) === code; })) {
      resCode = code; resKind = 'gone';
      $('#scanRes').innerHTML = '<p class="res-h no">' + esc(goneText(res.dup)) + '</p><p class="res-t">' + esc(res.dup.t || code) + '</p>' +
        '<div class="res-b"><button class="btn primary" data-act="back">È tornato in libreria</button><button class="btn" data-act="addcopy">Aggiungi un\'altra copia</button></div>';
      $('#scanRes').hidden = false;
    } else if (!res.dup.w && tab === 'lib') {
      var nc = state.books.filter(function (x) { return !x.w && !x.xs && L.toIsbn13(x.i) === code; }).length;
      resCode = code; resKind = 'dupadd';
      $('#scanRes').innerHTML = '<p class="res-h ok">Già in elenco' + (nc > 1 ? ' (' + nc + ' copie)' : '') + '</p><p class="res-t">' + esc(res.dup.t || code) + '</p>' +
        '<div class="res-b"><button class="btn" data-act="addcopy">Aggiungi un\'altra copia</button></div>';
      $('#scanRes').hidden = false;
    }
    return;
  }
  beep(true); vibrate(50);
  scanCtx.count++; scanCtx.added++;
  setScanCount(scanCtx.count + (scanCtx.count === 1 ? ' aggiunto' : ' aggiunti'));
  scanMsg('Aggiunto ' + code + '. Cerco il titolo…');
  var book = res.book;
  if (settings.price) { priceTarget = book.id; priceBar('Prezzo? Inquadra il prezzo stampato e tocca «Leggi il prezzo», oppure «Scrivi». Se non ti serve, passa al libro successivo.'); }
  res.done.then(function () {
    if (!scanning) return;
    scanMsg(book.t ? '✓ ' + book.t : (book.nf ? 'Non trovato nelle banche dati: lo completi dopo.' : 'Titolo da completare più tardi.'));
  });
}
/* ---------- «Ce l'ho già?»: controlla senza aggiungere ---------- */
var checkCache = {}, resCode = '', resKind = '';
function readLabel(b) {
  if (b.rs === 'ok') return 'Letto' + (b.rt ? ' · ' + '★'.repeat(b.rt) : '');
  return b.rs === 'in' ? 'In lettura' : b.rs === 'da' ? 'Da leggere' : '';
}
function shelfLine(b) {
  return [b.a, b.sh ? 'Scaffale: ' + b.sh : '', readLabel(b)].filter(Boolean).join(' · ');
}
function showRes(code, kind, book, info) {
  resCode = code; resKind = kind;
  var o = '';
  if (kind === 'have') {
    var ncp = state.books.filter(function (x) { return !x.w && !x.xs && L.toIsbn13(x.i) === code; }).length;
    o = '<p class="res-h ok">✓ Ce l\'hai già' + (ncp > 1 ? ' (' + ncp + ' copie)' : '') + '</p><p class="res-t">' + esc(book.t || code) + '</p>' +
      (shelfLine(book) ? '<p class="res-s">' + esc(shelfLine(book)) + '</p>' : '') +
      (book.p ? '<p class="res-s loan">' + esc(prestatoA(book.p)) + (book.pd ? ' dal ' + esc(L.itDate(book.pd)) : '') + '</p>' : '');
  } else if (kind === 'gone') {
    o = '<p class="res-h no">✗ Non ce l\'hai più</p><p class="res-t">' + esc(book.t || code) + '</p><p class="res-s">' + esc(goneText(book)) + '</p>' +
      '<div class="res-b"><button class="btn" data-act="back">È tornato in libreria</button></div>';
  } else if (kind === 'wish') {
    o = '<p class="res-h wish">★ È nella tua lista dei Desideri</p><p class="res-t">' + esc(book.t || code) + '</p>' +
      '<div class="res-b"><button class="btn primary" data-act="bought">L\'ho comprato: spostalo in Libreria</button></div>';
  } else if (kind === 'no') {
    var t = info === undefined ? 'Cerco il titolo…' : info ? info.t : (info === null ? 'Titolo sconosciuto alle banche dati' : 'Titolo non disponibile (connessione)');
    o = '<p class="res-h no">✗ Non ce l\'hai</p><p class="res-t">' + esc(t) + '</p>' +
      (info && info.a ? '<p class="res-s">' + esc(info.a) + '</p>' : '') + '<p class="res-s">ISBN ' + esc(code) + '</p>' +
      '<div class="res-b"><button class="btn primary" data-act="addlib">Aggiungi alla Libreria</button><button class="btn" data-act="addwish">Aggiungi ai Desideri</button></div>';
  } else {
    o = '<p class="res-h ok">✓ ' + esc(info) + '</p><p class="res-t">' + esc((book && book.t) || code) + '</p>';
  }
  $('#scanRes').innerHTML = o;
  $('#scanRes').hidden = false;
}
function onCheck(code) {
  scanCtx.count++;
  var ex = findByIsbn(code);
  var mine = state.books.filter(function (x) { return !x.w && L.toIsbn13(x.i) === code; }), here = mine.filter(function (x) { return !x.xs; });
  if (mine.length && !here.length) { beep(false); vibrate(160); showRes(code, 'gone', mine[0]); return; }
  if (here.length) ex = here[0];
  if (ex && !ex.w) { beep(true); setTimeout(function () { beep(true); }, 150); vibrate([60, 60, 60]); showRes(code, 'have', ex); }
  else if (ex) { beep(true); vibrate(60); showRes(code, 'wish', ex); }
  else {
    beep(false); vibrate(160);
    if (checkCache.hasOwnProperty(code)) { showRes(code, 'no', null, checkCache[code]); return; }
    showRes(code, 'no', null, undefined);
    if (navigator.onLine === false) { showRes(code, 'no', null, false); return; }
    L.lookupIsbn(code, lookupOpts()).then(function (r) {
      checkCache[code] = r || null;
      if (scanning && resCode === code && resKind === 'no') showRes(code, 'no', null, r || null);
    }, function () { if (scanning && resCode === code && resKind === 'no') showRes(code, 'no', null, false); });
  }
}
$('#scanPriceBtn').addEventListener('click', readLivePrice);
$('#scanRes').addEventListener('click', function (e) {
  var btn = e.target.closest('[data-act]');
  if (!btn || !resCode) return;
  var code = resCode, act = btn.dataset.act, pre = checkCache[code] || undefined;
  if (act === 'addlib' || act === 'addwish') {
    var res = addIsbn(code, { wish: act === 'addwish', pre: pre });
    var b = res.book || res.moved || res.dup;
    if (res.book) scanCtx.added++;
    showRes(code, 'done', b, act === 'addwish' ? 'Aggiunto ai Desideri' : 'Aggiunto alla Libreria');
    if (res.done) res.done.then(function () { if (scanning && resCode === code && resKind === 'done') showRes(code, 'done', b, act === 'addwish' ? 'Aggiunto ai Desideri' : 'Aggiunto alla Libreria'); });
  } else if (act === 'addcopy') {
    var src = state.books.find(function (x) { return !x.w && L.toIsbn13(x.i) === code; });
    var cpy = src && addCopy(src.id, true);
    if (cpy) { scanCtx.count++; scanCtx.added++; setScanCount(scanCtx.count + (scanCtx.count === 1 ? ' aggiunto' : ' aggiunti')); showRes(code, 'done', cpy, 'Aggiunta un\'altra copia'); }
  } else if (act === 'back') {
    var gb = state.books.find(function (x) { return !x.w && x.xs && L.toIsbn13(x.i) === code; });
    if (gb) { gb.xs = ''; gb.xd = ''; gb.xa = ''; touch(); showRes(code, 'done', gb, 'Di nuovo in libreria'); }
  } else if (act === 'bought') {
    var wb = findByIsbn(code);
    if (wb) { moveToLib(wb.id, true); scanCtx.added++; showRes(code, 'done', wb, 'Spostato in Libreria'); }
  }
});
async function toggleTorch() {
  try {
    torchOn = !torchOn;
    await stream.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: torchOn }] });
  } catch (e) { torchOn = false; }
}

/* ---------- vista ---------- */
function visible() {
  var a = tabBooks();
  var nq = L.norm(q);
  if (nq) a = a.filter(function (b) { return L.norm([b.t, b.a, b.e, b.i, b.sh, b.gen, b.n, b.p, b.xa].join(' ')).indexOf(nq) >= 0; });
  if (flt === 'guess') a = a.filter(function (b) { return b.g.length; });
  if (flt === 'gone') a = a.filter(function (b) { return b.xs; });
  if (flt === 'fav') a = a.filter(function (b) { return b.fav; });
  if (frFlt) a = a.filter(function (b) { return b.fr === frFlt; });
  if (flt === 'dup') { var dm = L.analyzeDups(state.books); a = a.filter(function (b) { return dm[b.id]; }); }
  if (shFlt) a = a.filter(function (b) { return facetKey(b.sh) === shFlt; });
  if (genFlt) a = a.filter(function (b) { return facetKey(b.gen) === genFlt; });
  if (autFlt) a = a.filter(function (b) { return authorsOf(b).some(function (n) { return L.norm(n) === autFlt; }); });
  if (edFlt) a = a.filter(function (b) { return facetKey(b.e) === edFlt; });
  if (readFlt && tab === 'lib') a = a.filter(function (b) { return readFlt === 'no' ? !b.rs : b.rs === readFlt; });
  if (flt === 'loan') {
    return a.filter(function (b) { return b.p; }).sort(function (x, y) { return (x.pd || '9') < (y.pd || '9') ? -1 : (x.pd || '9') > (y.pd || '9') ? 1 : cmpFor('titolo')(x, y); });
  }
  return a.sort(cmpFor(sortBy));
}
function cmpFor(k) {
  var byTitle = function (x, y) { return coll.compare(L.sortKeyTitle(x.t) || '~', L.sortKeyTitle(y.t) || '~'); };
  var byAuthor = function (x, y) { return coll.compare(L.sortKeyAuthor(x.a) || '~', L.sortKeyAuthor(y.a) || '~'); };
  if (k === 'titolo') return byTitle;
  if (k === 'autore') return function (x, y) { return byAuthor(x, y) || byTitle(x, y); };
  if (k === 'editore') return function (x, y) { return coll.compare(x.e || '~', y.e || '~') || byAuthor(x, y) || byTitle(x, y); };
  if (k === 'anno') return function (x, y) { return (Number(x.y) || 99999) - (Number(y.y) || 99999) || byTitle(x, y); };
  if (k === 'voto') return function (x, y) { return (y.rt || 0) - (x.rt || 0) || byTitle(x, y); };
  if (k === 'letti') return function (x, y) { return (y.rd || '') < (x.rd || '') ? -1 : (y.rd || '') > (x.rd || '') ? 1 : byTitle(x, y); };
  if (k === 'scaffale') return function (x, y) { return coll.compare(x.sh || '~', y.sh || '~') || byAuthor(x, y) || byTitle(x, y); };
  return function (x, y) { return y.ts - x.ts; };
}
function computeDups() { return L.analyzeDups(state.books); }
function flagsHTML(b, dups) {
  var s = S[b.id] || {}, o = '';
  if (b.p) o += '<span class="tag loan tap" data-act="loan" role="button" tabindex="0" title="In prestito' + (b.pd ? ' dal ' + esc(L.itDate(b.pd)) : '') + '. Toccalo per segnarlo come restituito.">' + esc(loanText(b)) + '</span>';
  o += goneTag(b);
  o += fromTag(b);
  if (b.g.length) o += '<span class="tag warn tap" data-act="verify" role="button" tabindex="0" title="Dati dedotti (dalla copertina o dal codice ISBN): controllali, potrebbero non coincidere con il tuo libro. Toccalo quando hai controllato.">Da verificare ✓</span>';
  o += dupTag(dups && dups[b.id]);
  if (b.i && !L.toIsbn13(b.i)) o += '<span class="tag bad" title="La cifra di controllo non torna: ricontrolla le cifre">ISBN non valido</span>';
  else if (!b.t && b.i && !s.st) o += b.nf ? '<span class="tag warn" title="Nessuna banca dati conosce questo codice: scrivi i dati a mano">Non trovato</span>' : '<span class="tag" title="Titolo ancora da cercare">Da completare</span>';
  return o;
}
/* Scheda chiusa (solo titolo e autore) o aperta (tutti i campi). Di regola chiusa; aperta da sola se manca il titolo
   e il libro non e' in lavorazione (va compilato a mano). Una volta aperta resta aperta finche' non la chiudi. */
function isOpen(b) {
  if (settings.openAll) return true;
  if (openState[b.id] != null) return openState[b.id];
  var st = (S[b.id] || {}).st, busy = st === 'queued' || st === 'reading' || st === 'lookup' || st === 'search';
  if (!b.t && !busy) { openState[b.id] = true; return true; }
  return false;
}
/* libro arrivato da una condivisione: da chi, e da quale lista */
function fromTag(b) {
  if (!b.fr) return '';
  return '<span class="tag from" title="' + esc('Ricevuto da ' + b.fr + (b.fl ? ', dalla lista «' + b.fl + '»' : '')) + '">Da ' + esc(b.fr) + '</span>';
}
var GONE_VERB = { v: 'Venduto', r: 'Regalato', s: 'Smarrito' };
function aChi(p) { return (/^[aA]/.test(p) ? 'ad ' : 'a ') + p; }
function goneText(b) {
  if (!b.xs) return '';
  var d = b.xd ? L.itDate(b.xd) : '';
  if (b.xs === 's') return 'Smarrito' + (d ? ' dal ' + d : '');
  return GONE_VERB[b.xs] + (b.xa ? ' ' + aChi(b.xa) : '') + (d ? ' il ' + d : '');
}
function goneTag(b) {
  return b.xs ? '<span class="tag gone tap" data-act="loan" role="button" tabindex="0" title="Non è più in libreria. Tocca per cambiare o se è tornato.">' + esc(goneText(b)) + '</span>' : '';
}
function prestatoA(p) { return 'Prestato ' + (/^[aA]/.test(p) ? 'ad ' : 'a ') + p; }   // «ad Anna», «a Marco»
function loanText(b) {
  if (!b.pd) return prestatoA(b.p);
  var ago = L.agoText(Date.parse(b.pd));
  return prestatoA(b.p) + ' · ' + (ago === 'oggi' ? 'da oggi' : ago === 'ieri' ? 'da ieri' : 'da ' + ago.replace(/ fa$/, ''));
}
function summaryHTML(b, dups, status) {
  var s = S[b.id] || {}, tags = '';
  if (b.p) tags += '<span class="tag loan tap" data-act="loan" role="button" tabindex="0" title="Tocca per segnarlo come restituito">' + esc(loanText(b)) + '</span>';
  tags += goneTag(b);
  if (b.fav && !b.w) tags += '<span class="tag fav">Preferito</span>';
  tags += fromTag(b);
  if (b.g.length) tags += '<span class="tag warn">Da verificare</span>';
  if (!b.w && (b.rs === 'in' || b.rs === 'ok')) tags += '<span class="tag read' + (b.rs === 'in' ? ' now' : '') + '">' + esc(readLabel(b)) + '</span>';
  tags += dupTag(dups && dups[b.id]);
  if (b.i && !L.toIsbn13(b.i)) tags += '<span class="tag bad">ISBN non valido</span>';
  else if (!b.t && b.i && !s.st && b.nf) tags += '<span class="tag warn">Non trovato</span>';
  var title = b.t || (b.i ? 'ISBN ' + b.i : 'Senza titolo');
  var img = smallImg(b);
  var cover = img ? '<span class="sum-img zoom" data-act="zoom" title="Ingrandisci la copertina"><img src="' + esc(img) + '" alt="Copertina: tocca per ingrandire" loading="lazy" referrerpolicy="no-referrer"></span>'
    : '<span class="sum-img ph" style="--h:' + hue(b.t + b.a + b.i) + '" aria-hidden="true">' + esc((b.t || '?').replace(/^(il|lo|la|i|gli|le|un|uno|una|l')\s*/i, '').charAt(0).toUpperCase() || '?') + '</span>';
  return '<article class="row closed' + (status.indexOf('status err') >= 0 ? ' bad' : '') + (b.xs ? ' gone' : '') + '" data-id="' + b.id + '">' +
    '<div class="sum" data-act="toggle" role="button" tabindex="0" aria-expanded="false" aria-label="' + esc(title + (b.a ? ', ' + b.a : '') + '. Apri la scheda') + '">' + cover +
    '<span class="sum-txt"><span class="sum-t' + (b.t ? '' : ' none') + '">' + esc(title) + '</span>' +
    (b.a ? '<span class="sum-a">' + esc(b.a) + '</span>' : '') +
    (tags ? '<span class="sum-tags">' + tags + '</span>' : '') + '</span>' +
    '<span class="chev" aria-hidden="true">' + icon('chev') + '</span></div>' + status + '</article>';
}
function toggleRow(id) {
  var b = get(id);
  if (!b) return;
  var open = !isOpen(b);
  openState[id] = open;
  refreshRow(id);
  updateStick();
  var el = rowEl(id);
  if (el) { el.scrollIntoView({ block: 'nearest' }); var f = el.querySelector(open ? '.chev-btn' : '.sum'); if (f) f.focus({ preventScroll: true }); }
}
/* ---- «Descrizione»: riquadro richiudibile nella scheda aperta; la prima apertura la cerca online, poi resta nel libro ---- */
var descOpen = {}, descBusy = {}, descFull = {}, descErr = {};
var DESC_SRC = { g: 'Google Libri', o: 'Open Library' };
var DESC_CLIP = 420;
function descHTML(b, off) {
  if (off || !hasData(b) || !(b.t || L.toIsbn13(b.i))) return '';
  return '<details class="desc" data-id="' + b.id + '"' + (descOpen[b.id] ? ' open' : '') + '><summary><span class="desc-h">Descrizione</span>' +
    (b.ds ? '' : '<span class="desc-hint">tocca per cercarla</span>') + '</summary><div class="desc-b" aria-live="polite">' + descBody(b) + '</div></details>';
}
function descBody(b) {
  if (descBusy[b.id]) return '<p class="desc-wait"><span class="spin" aria-hidden="true"></span>Cerco la descrizione…</p>';
  if (b.ds) {
    var long = b.ds.length > DESC_CLIP && !descFull[b.id];
    var foreign = b.dsl && b.dsl !== 'it';
    return '<div class="desc-t' + (long ? ' clip' : '') + '">' + b.ds.split(/\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      (long ? '<button type="button" class="link" data-act="descmore">Leggi tutto</button>' : '') +
      '<p class="desc-src">Fonte: ' + esc(DESC_SRC[b.dsf] || 'web') + (foreign ? (b.dsl === 'en' ? ' · in inglese' : ' · in un\'altra lingua') : '') + '</p>' +
      '<div class="desc-acts">' + (foreign ? '<a class="link" target="_blank" rel="noopener" href="https://translate.google.com/?sl=auto&tl=it&op=translate&text=' + encodeURIComponent(b.ds) + '">Traduci in italiano</a>' : '') +
      '<button type="button" class="link quiet" data-act="descdel">Non è questo libro: toglila</button></div>';
  }
  if (descErr[b.id]) return '<p class="desc-none">' + esc(descErr[b.id]) + '</p><button type="button" class="link" data-act="descretry">Riprova</button>';
  if (b.dsn) return '<p class="desc-none">Nessuna descrizione trovata nelle banche dati per questo libro.</p><button type="button" class="link" data-act="descretry">Cerca di nuovo</button>';
  if (navigator.onLine === false) return '<p class="desc-none">Senza connessione: la cerco appena riapri il riquadro con la rete.</p>';
  return '';
}
function paintDesc(id) {
  var b = get(id);
  Array.prototype.forEach.call(document.querySelectorAll('details.desc[data-id="' + id + '"]'), function (d) {
    var body = d.querySelector('.desc-b'), hint = d.querySelector('.desc-hint');
    if (b && body) body.innerHTML = descBody(b);
    if (b && b.ds && hint) hint.remove();
  });
}
async function findDesc(b) {
  var isbn = L.toIsbn13(b.i), tries = 0, errs = 0, best = null;
  var key = settings.gbKey ? '&key=' + encodeURIComponent(settings.gbKey) : '';
  async function gq(q, n) {
    if (!googleLeft(false)) return null;
    tries++;
    try {
      return await L.getJson(apiFetch, 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(q) + '&maxResults=' + n +
        '&fields=items(volumeInfo(title,subtitle,authors,language,description))' + key, { waits: [900], timeout: 9000 });
    } catch (e) { errs++; return null; }
  }
  async function ol(path) {
    tries++;
    try { return await L.getJson(fetch, 'https://openlibrary.org' + path, { waits: [], timeout: 9000 }); }
    catch (e) { if (e && e.status !== 404) errs++; return null; }
  }
  function take(r, src) { if (r && (!best || (best.lang !== 'it' && r.lang === 'it'))) best = { text: r.text, lang: r.lang, src: src }; }
  if (isbn) take(L.pickDesc(await gq('isbn:' + isbn, 3), ''), 'g');
  if ((!best || best.lang !== 'it') && b.t) {
    var a = L.str(b.a).split(/[,;]/)[0].trim();
    take(L.pickDesc(await gq('intitle:"' + b.t.replace(/"/g, '') + '"' + (a ? ' inauthor:"' + a.replace(/"/g, '') + '"' : ''), 6), b.t, a), 'g');
  }
  if (!best && isbn) {
    var ed = await ol('/isbn/' + isbn + '.json'), t = L.olDesc(ed);
    var wk = ed && Array.isArray(ed.works) && ed.works[0] && ed.works[0].key;
    if (!t && /^\/works\/OL\d+W$/.test(L.str(wk))) t = L.olDesc(await ol(wk + '.json'));
    if (t) take({ text: t, lang: L.guessLang(t) }, 'o');
  }
  if (!best && tries && errs === tries) throw { net: true };
  return best;
}
async function loadDesc(id, force) {
  var b = get(id);
  if (!b || descBusy[id] || b.ds || (b.dsn && !force)) return;
  if (navigator.onLine === false) { paintDesc(id); return; }
  delete descErr[id];
  descBusy[id] = true; paintDesc(id);
  var r = null, failed = false;
  try { r = await findDesc(b); } catch (e) { failed = true; }
  delete descBusy[id];
  b = get(id);
  if (!b) return;
  if (r) { b.ds = r.text; b.dsf = r.src; b.dsl = r.lang || ''; b.dsn = 0; touch(); }
  else if (failed) descErr[id] = navigator.onLine === false ? 'Senza connessione: non sono riuscito a cercarla.' : 'Connessione debole: non sono riuscito a cercarla.';
  else { b.dsn = Date.now(); touch(); }
  paintDesc(id);
}
/* stato di lettura, voto e data (solo Libreria) */
function readHTML(b, off) {
  if (b.w) return '';
  var d = off ? ' disabled' : '';
  var seg = [['da', 'Da leggere'], ['in', 'In lettura'], ['ok', 'Letto']].map(function (x) {
    return '<button type="button" data-act="rs" data-v="' + x[0] + '" aria-pressed="' + (b.rs === x[0]) + '"' + d + '>' + x[1] + '</button>';
  }).join('');
  var stars = [1, 2, 3, 4, 5].map(function (n) {
    return '<button type="button" class="star' + (b.rt >= n ? ' on' : '') + '" data-act="rt" data-v="' + n + '" role="radio" aria-checked="' + (b.rt === n) + '" aria-label="' + n + (n === 1 ? ' stella' : ' stelle') + '"' + d + '>★</button>';
  }).join('');
  return '<div class="read"><span class="lbl">Lettura</span><div class="seg" role="group" aria-label="Stato di lettura">' + seg + '</div>' +
    '<div class="stars" role="radiogroup" aria-label="Voto">' + stars + '</div>' +
    (b.rs === 'ok' ? '<label class="f f-rd"><span class="lbl">Letto il</span><input type="date" data-k="rd" id="rd-' + b.id + '" value="' + esc(b.rd || '') + '"' + d + '></label>' : '') + '</div>';
}
/* «Tutti i libri di …» se dello stesso autore ce ne sono altri */
function authorLinkHTML(b, ex) {
  if (ex || !hasData(b)) return '';
  var out = '';
  if (!b.w && (b.t || L.toIsbn13(b.i))) out += '<button type="button" class="link" data-act="addcopy">+ Aggiungi un\'altra copia</button>';
  return out ? '<div class="links">' + out + '</div>' : '';
}
var FACET_ICON = { a: 'user', e: 'pub', gen: 'tag', sh: 'shelf' };
var FACET_WORD = { a: 'Autore', e: 'Casa editrice', gen: 'Genere', sh: 'Scaffale' };
function facetsHTML(b, ex) {
  if (ex || !hasData(b)) return '';
  var books = tabBooks(), out = [];
  function chip(f, key, label, n) {
    out.push('<button type="button" class="fchip" data-act="facet" data-f="' + f + '" data-v="' + esc(key) + '" data-name="' + esc(label) + '" title="Mostra tutti i ' + n + ' libri: ' + esc(FACET_WORD[f].toLowerCase() + ' ' + label) + '">' +
      icon(FACET_ICON[f]) + '<span class="fl">' + esc(label) + '</span><span class="n">' + n + '</span></button>');
  }
  if (b.g.indexOf('a') < 0) authorsOf(b).slice(0, 3).forEach(function (name) {
    var k = L.norm(name);
    var n = books.filter(function (x) { return authorsOf(x).some(function (y) { return L.norm(y) === k; }); }).length;
    if (n > 1) chip('a', k, name, n);
  });
  [['e', b.g.indexOf('e') < 0], ['gen', true], ['sh', true]].forEach(function (p) {
    var f = p[0], v = String(b[f] || '').trim();
    if (!p[1] || !v) return;
    var k = facetKey(v), n = books.filter(function (x) { return facetKey(x[f]) === k; }).length;
    if (n > 1) chip(f, k, v, n);
  });
  return out.length ? '<div class="facets"><span class="facets-h">' + icon('filt') + 'Vedi tutti i libri di</span><div class="fchips">' + out.join('') + '</div></div>' : '';
}
function applyFacet(f, key, name) {
  flt = ''; readFlt = ''; shFlt = ''; genFlt = ''; autFlt = ''; autName = ''; edFlt = ''; frFlt = '';
  q = ''; $('#q').value = '';
  collapseCards();
  if (f === 'a') { autFlt = key; autName = name; }
  else if (f === 'e') edFlt = key;
  else if (f === 'gen') genFlt = key;
  else if (f === 'sh') shFlt = key;
  renderList(); updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  var n = visible().length;
  toast((f === 'a' ? 'Libri di ' : FACET_WORD[f] + ' «') + name + (f === 'a' ? '' : '»') + ': ' + n + '. Per tornare a tutti, tocca la × del filtro sotto la ricerca.');
}
function dupTag(v) {
  if (v === 'dup') return '<span class="tag tap" data-act="dup" role="button" tabindex="0" title="Un altro libro nell\'elenco ha lo stesso ISBN o lo stesso titolo e autore: tocca per decidere">Doppione?</span>';
  if (v > 1) return '<span class="tag copies tap" data-act="dup" role="button" tabindex="0" title="Hai più copie di questo libro">' + v + ' copie</span>';
  return '';
}
function bar(txt) { return '<div class="status"><span class="bar"></span><span class="txt">' + esc(txt) + '</span></div>'; }
function rowHTML(b, dups, ex) {
  var s = S[b.id] || {}, st = s.st;
  var busy = st === 'queued' || st === 'reading' || st === 'lookup' || st === 'search';
  var fresh = st && !hasData(b);
  var dis = (busy || ex) ? ' disabled' : '';
  var imgSrc = smallImg(b);
  var canShoot = !ex && !busy && !imgSrc && hasData(b);
  var hasThumb = !!imgSrc || (!!st && !ex) || canShoot;
  var cls = 'row' + (busy ? ' busy' : '') + (st === 'error' ? ' bad' : '') + (hasThumb ? ' has-thumb' : '') + (ex ? ' ex' : '') + (b.xs ? ' gone' : '');
  function fieldTitle(k) { return b.g.indexOf(k) >= 0 ? ' title="Da verificare"' : ''; }
  function ta(k, label, val, ph) {
    return '<label class="f f-' + k + (b.g.indexOf(k) >= 0 ? ' is-guess' : '') + '"' + fieldTitle(k) + '><span class="lbl">' + label + '</span>' +
      '<textarea id="' + k + '-' + b.id + '" data-k="' + k + '" rows="1" spellcheck="false" placeholder="' + ph + '"' + dis + '>' + esc(val) + '</textarea></label>';
  }
  function inp(k, label, val, mode, ph, max, listId) {
    return '<label class="f f-' + k + (b.g.indexOf(k) >= 0 ? ' is-guess' : '') + '"' + fieldTitle(k) + '><span class="lbl">' + label + '</span>' +
      '<input id="' + k + '-' + b.id + '" data-k="' + k + '" inputmode="' + mode + '" autocomplete="off" placeholder="' + ph + '"' + (max ? ' maxlength="' + max + '"' : '') + (listId ? ' list="' + listId + '"' : '') + ' value="' + esc(val) + '"' + dis + '></label>';
  }
  var status = '';
  if (st === 'queued') status = bar('In coda…');
  else if (st === 'reading') status = bar(s.msg || 'Leggo la foto…');
  else if (st === 'lookup') status = bar('Cerco nelle banche dati…');
  else if (st === 'search') status = bar('Cerco il libro…');
  else if (st === 'choose') status = '<div class="status"><span class="txt">Trovate ' + ((s.cands || []).length) + ' possibili edizioni.</span><button class="btn primary" data-act="choose">Scegli</button></div>';
  else if (st === 'wait') status = '<div class="status wait"><span class="txt">' + esc(s.err || 'In attesa della rete.') + '</span><button class="btn" data-act="retry">Riprova ora</button></div>';
  else if (st === 'error') status = '<div class="status err" role="alert"><span class="txt">' + esc(s.err || 'Operazione non riuscita.') + '</span>' + (s.retry ? '<button class="btn" data-act="retry">Riprova</button>' : '') + '</div>';

  var thumb = canShoot
    ? (covSearching[b.id]
      ? '<span class="thumb add busy" role="status" title="Cerco la copertina…"><span class="spin" aria-hidden="true"></span><span class="tl">Cerco…</span></span>'
      : '<button class="thumb add" data-act="coverphoto" title="Cerca la copertina online; se non c\'è, la fotografi">' + icon('cam') + '<span class="tl">Copertina</span></button>')
    : '<div class="thumb' + (hasThumb ? '' : ' empty') + (imgSrc && !ex ? ' zoom" data-act="zoom" role="button" tabindex="0" title="Ingrandisci la copertina' : '') + '">' + (imgSrc ? '<img src="' + esc(imgSrc) + '" alt="" referrerpolicy="no-referrer">' : '') + '</div>';
  var body;
  if (fresh) {
    cls += ' fresh';
    var acts = (st === 'error' || st === 'choose') ? '<div class="tail"><button class="ico act danger" data-act="del" title="Elimina il libro" aria-label="Elimina il libro">' + icon('x') + '<span class="al" aria-hidden="true">Elimina</span></button></div>' : '';
    return '<article class="' + cls + '" data-id="' + b.id + '">' + (hasThumb ? thumb : '') + status + acts + '</article>';
  } else {
    if (!ex && !isOpen(b)) return summaryHTML(b, dups, status);
    var canLookup = !busy && !ex && !b.t && L.toIsbn13(b.i);
    var openCard = !ex && !settings.openAll;
    if (openCard) cls += ' open has-top';
    /* azioni principali: in alto accanto alla freccetta (scheda aperta), in fondo nelle schede sempre aperte */
    var stateOn = !!(b.p || b.xs);
    /* azioni con icona e scritta, tutte nello stesso stile; la × (elimina) e la freccetta (chiudi) restano solo icona */
    function act(a, ic, label, title, cls) { return '<button class="ico act' + (cls || '') + '" data-act="' + a + '" title="' + esc(title) + '" aria-label="' + esc(title) + '">' + icon(ic) + '<span class="al" aria-hidden="true">' + esc(label) + '</span></button>'; }
    var stateLabel = b.xs ? (L.GONE_LABEL[b.xs] || 'Non più qui') : b.p ? 'Prestato' : 'Presta';
    var loanBtn = (!busy && !b.w && hasData(b) && (openCard || !stateOn))
      ? act('loan', 'loan', stateLabel, stateOn ? (b.xs ? goneText(b) : loanText(b)) + ': tocca per cambiare' : 'Segna il libro come prestato, venduto, regalato o smarrito', stateOn ? ' on' : '') : '';
    var delBtn = act('del', 'x', 'Elimina', 'Elimina il libro', ' danger');
    var moveBtn = !busy && hasData(b) ? (b.w
      ? act('tolib', 'tolib', 'Libreria', 'Sposta in Libreria (l\'ho comprato)', ' move')
      : act('towish', 'towish', 'Desideri', 'Sposta nei Desideri', ' move')) : '';
    var favBtn = !busy && !b.w && hasData(b) ? act('fav', 'fav', 'Preferito', b.fav ? 'È tra i preferiti: tocca per toglierlo' : 'Metti tra i preferiti', b.fav ? ' fav on' : ' fav') : '';
    var shareBtn = !busy && (b.t || L.toIsbn13(b.i)) ? act('share', 'share', 'Condividi', 'Manda questo libro a un amico') : '';
    var moreActs = shareBtn + (canLookup ? act('lookup', 'redo', 'Cerca di nuovo', 'Cerca di nuovo nelle banche dati') : '') +
        (canLookup && b.nf ? act('web', 'search', 'Cerca sul web', 'Cerca questo codice sul web') : '') +
        (!busy && b.c == null && hasData(b) ? act('pricephoto', 'pricetag', 'Prezzo da foto', 'Leggi il prezzo di copertina da una foto del retro') : '') +
        (!busy && b.c == null && hasData(b) && (L.toIsbn13(b.i) || b.t) ? act('priceweb', 'euro', 'Prezzo dal web', 'Cerca il prezzo sul web') : '') +
        '';
    body = (openCard ? '<div class="card-top"><span class="top-acts"><span class="acts-main">' + loanBtn + moveBtn + favBtn + delBtn + '</span><span class="acts-win">' +
        '<button class="chev-btn" data-act="toggle" aria-expanded="true" aria-label="Chiudi la scheda" title="Chiudi la scheda">' + icon('chev') + '</button></span></span>' +
        '<span class="flags">' + flagsHTML(b, dups) + '</span></div>' : '') +
      '<div class="head">' + thumb + ta('t', 'Titolo', b.t, 'Titolo') + ta('a', 'Autore', b.a, 'Autore') + '</div>' +
      '<div class="meta">' + ta('e', 'Casa editrice', b.e, 'Casa editrice') + inp('y', 'Anno', b.y, 'numeric', 'Anno', 4) + inp('c', 'Costo €', b.c == null ? '' : L.fmtNum(b.c), 'decimal', '—') + '</div>' +
      (settings.extra ? '<div class="more">' + inp('sh', 'Scaffale', b.sh || '', 'text', 'Scaffale', 80) + inp('gen', 'Genere', b.gen || '', 'text', 'Genere', 80) +
        inp('pg', 'Pagine', b.pg || '', 'numeric', 'Pagine', 5) + ta('n', 'Note', b.n || '', 'Note') + '</div>' : '') +
      facetsHTML(b, ex || busy) + descHTML(b, ex || busy) + readHTML(b, ex || busy) + authorLinkHTML(b, ex) +
      '<div class="foot">' + inp('i', 'ISBN', b.i, 'numeric', 'ISBN', 13) +
      (openCard ? (moreActs ? '<div class="tail">' + moreActs + '</div>' : '') :
        '<div class="tail"><span class="flags">' + flagsHTML(b, dups) + '</span>' +
        (ex ? '<span class="tag">Esempio</span>' : moreActs + favBtn + moveBtn + loanBtn + delBtn) + '</div>') +
      '</div>';
  }
  return '<article class="' + cls + '" data-id="' + b.id + '"' + (ex ? ' data-ex="1"' : '') + '>' + status + body + '</article>';
}
/* benvenuto della Libreria vuota: i tre modi di aggiungere (toccabili come i tasti in basso) e il ripristino da backup */
function emptyHTML() {
  function way(act, ic, html) { return '<li><button type="button" class="way" data-act="' + act + '"><span class="way-i" aria-hidden="true">' + icon(ic) + '</span><span class="way-t">' + html + '</span></button></li>'; }
  return '<section class="empty welcome"><h2>Aggiungi il primo libro</h2>' +
    '<p class="lead">Di solito basta il codice a barre sul retro: titolo, autore, editore e anno si compilano da soli.</p>' +
    '<ul class="ways">' +
    way('way-scan', 'scan', '<b>Scansiona</b><small>Inquadra il codice a barre. Se il libro non ce l\'ha, nella fotocamera scegli «ISBN scritto» o «Copertina».</small>') +
    way('way-photo', 'cam', '<b>Foto</b><small>Scatta la copertina o prendila dalla galleria, anche più foto insieme: l\'app le legge e cerca i libri.</small>') +
    way('way-type', 'key', '<b>Digita</b><small>Scrivi l\'ISBN o il titolo e scegli tra i risultati.</small>') +
    '</ul>' +
    '<p class="then">Dopo ogni libro puoi inquadrare il prezzo, scriverlo o saltarlo. Poi tocca un libro per aprire la sua scheda: scaffale, genere, lettura, prestiti e note.</p>' +
    '<label class="who"><span>Come ti chiami? <small>(facoltativo)</small></span><input type="text" id="welcomeName" maxlength="30" autocomplete="given-name" autocapitalize="words" placeholder="es. Piero" value="' + esc(settings.name || '') + '">' +
    '<small>Serve quando mandi un libro o una lista a un amico: vedrà «Piero ti consiglia un libro».</small></label>' +
    '<p class="restore-l">Hai già un backup, da un altro telefono o da prima? <button type="button" class="link" data-act="restore">Ripristinalo</button></p>' +
    '</section>';
}
function wishEmptyHTML() {
  return '<section class="empty"><h2>La lista dei Desideri è vuota</h2>' +
    '<p>Qui metti i libri che vuoi comprare. Mentre sei in questa scheda, <b>Scansiona</b>, <b>Foto</b> e <b>Digita</b> aggiungono i libri ai Desideri invece che alla Libreria.</p>' +
    '<p>Un amico ti consiglia un libro? Cercalo per titolo e aggiungilo qui:</p><p><button class="btn primary" data-act="typeadd">' + icon('search') + 'Cerca per titolo</button></p>' +
    '<p>Quando ne compri uno, nella sua scheda tocca il tasto con i libri e la freccia: passa in Libreria. In negozio usa <b>Ce l\'ho già?</b> per non ricomprare un libro che hai.</p></section>';
}
/* vista copertine */
function hue(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 360; }
function coverHTML(b) {
  var s = S[b.id] || {}, img = bigImg(b);
  var badge = isBusy(b) ? '<span class="badge">…</span>' : b.p ? '<span class="badge loan">Prestato</span>' : b.g.length ? '<span class="badge warn">Da verificare</span>' : '';
  var fav = b.fav && !b.w ? '<span class="ribbon" title="Preferito"><svg viewBox="0 0 20 30" aria-hidden="true"><path d="M1 0h18v28l-9-6.5L1 28z"/></svg></span>' : '';
  return '<button class="cover' + (fav ? ' is-fav' : '') + '" data-id="' + b.id + '" aria-label="' + esc([b.t || 'Senza titolo', b.a, fav ? 'preferito' : ''].filter(Boolean).join(', ')) + '">' +
    '<span class="art">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' :
      '<span class="ph" style="--h:' + hue(b.t + b.a + b.i) + '"><b>' + esc(b.t || b.i || 'Senza titolo') + '</b><small>' + esc(b.a) + '</small></span>') + badge + fav + '</span>' +
    '<span class="cap">' + esc(b.t || b.i || '…') + '</span><span class="cap2">' + esc(b.a) + '</span></button>';
}
function autosize(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
function autosizeAll(root) {
  var els = Array.prototype.slice.call(root.querySelectorAll('textarea'));
  els.forEach(function (e) { e.style.height = 'auto'; });
  var hs = els.map(function (e) { return e.scrollHeight; });
  els.forEach(function (e, i) { if (hs[i]) e.style.height = hs[i] + 'px'; });
}
function syncThumbs() {
  var any = state.books.some(function (b) { return !!smallImg(b); });
  document.body.classList.toggle('thumbs', any);
}
function fillDatalists() {
  function opts(k) {
    var seen = {}, out = [];
    state.books.forEach(function (b) { var v = (b[k] || '').trim(); if (v && !seen[v.toLowerCase()]) { seen[v.toLowerCase()] = 1; out.push(v); } });
    return out.sort(coll.compare).map(function (v) { return '<option value="' + esc(v) + '">'; }).join('');
  }
  $('#shelfList').innerHTML = opts('sh');
  $('#genreList').innerHTML = opts('gen');
  $('#loanNames').innerHTML = opts('p');
}
var tGrid = null;
/* Barra in alto (schede, ricerca, filtri, Copertine...) ferma mentre scorri l'elenco compatto;
   se c'e' una scheda aperta torna a scorrere via con la pagina, per lasciare spazio ai campi. */
function updateStick() {
  var open = settings.openAll || !!document.querySelector('#list .row.open');
  document.body.classList.toggle('card-open', open);
  var st = $('#stick');
  if (st) document.documentElement.style.setProperty('--stick-h', (open ? 0 : st.offsetHeight) + 'px');
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (en) {
    var stuck = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
    $('#stick').classList.toggle('stuck', stuck);
    document.body.classList.toggle('stuck', stuck);
    setTimeout(updateStick, 0);
  }).observe($('#stickSentinel'));
}
window.addEventListener('resize', function () { updateStick(); });
function renderList() {
  clearTimeout(tGrid);
  setTimeout(updateStick, 0);
  if (scanning) return;
  var list = $('#list');
  syncThumbs();
  fillDatalists();
  var vis = visible(), n = tabBooks().length;
  document.body.classList.toggle('gridview', settings.view === 'grid');
  document.body.classList.toggle('openall', settings.openAll);
  $('#thead').hidden = n === 0 || settings.view === 'grid' || !settings.openAll;
  document.body.classList.toggle('welcome-on', !n && tab !== 'wish');   // col benvenuto il suggerimento sotto i tasti ripeterebbe le stesse cose
  if (!n) { list.innerHTML = tab === 'wish' ? wishEmptyHTML() : emptyHTML(); autosizeAll(list); return; }
  if (!vis.length) {
    var only = !q && activeCount() === 1;
    list.innerHTML = only && flt === 'loan'
      ? '<p class="none">Nessun libro in prestito. Per prestarne uno apri la sua scheda con la freccetta e tocca il tasto con la freccia verso destra.</p>'
      : only && flt === 'gone' ? '<p class="none">Nessun libro venduto, regalato o smarrito.</p>'
      : '<p class="none">Nessun libro corrisponde ' + (activeCount() ? (q ? 'alla ricerca e ai filtri.' : 'ai filtri.') : 'alla ricerca.') + '</p><p><button class="btn" data-act="clearflt">' + (activeCount() ? (q ? 'Azzera ricerca e filtri' : 'Azzera i filtri') : 'Cancella la ricerca') + '</button></p>';
    return;
  }
  if (settings.view === 'grid') { list.innerHTML = '<div class="grid">' + vis.map(coverHTML).join('') + '</div>'; return; }
  var dups = computeDups();
  list.innerHTML = vis.map(function (b) { return rowHTML(b, dups); }).join('');
  autosizeAll(list);
}
function rowEl(id) { return $('#list').querySelector('[data-id="' + id + '"]'); }
function refreshRow(id) {
  if (scanning) return;
  if (settings.view === 'grid') { clearTimeout(tGrid); tGrid = setTimeout(renderList, 120); return; }
  var b = get(id), el = rowEl(id);
  if (!b || !inTab(b)) { if (el) el.remove(); if (!tabBooks().length) renderList(); return; }
  if (!el) { renderList(); return; }
  syncThumbs();
  var t = document.createElement('template');
  t.innerHTML = rowHTML(b, computeDups());
  var fresh = t.content.firstElementChild;
  el.replaceWith(fresh);
  autosizeAll(fresh);
}
function eur(n) { return eurFmt.format(n); }
function updateSummary() {
  var all = tabBooks().filter(hasData), done = all.filter(function (b) { return !b.xs; });
  var gone = all.length - done.length;
  var total = done.reduce(function (a, b) { return a + (b.c || 0); }, 0);
  var g = all.filter(function (b) { return b.g.length; }).length;
  var loans = tab === 'lib' ? done.filter(function (b) { return b.p; }).length : 0;
  var n = done.length;
  $('#summary').innerHTML = tab === 'wish'
    ? (n ? '<b>' + n + '</b> da comprare · <b>' + esc(eur(total)) + '</b>' : 'Nessun libro da comprare')
    : (n ? '<b>' + n + '</b> ' + (n === 1 ? 'libro' : 'libri') + ' · <b>' + esc(eur(total)) + '</b>' + (g ? ' · ' + g + ' da verificare' : '') + (loans ? ' · ' + loans + ' in prestito' : '') + (gone ? ' · ' + gone + ' non più in libreria' : '')
      : (gone ? gone + ' non più in libreria' : 'Ancora nessun libro'));
  var nl = state.books.filter(function (b) { return !b.w && !b.xs && hasData(b); }).length, nw = state.books.filter(function (b) { return b.w && hasData(b); }).length;
  $('#cntLib').textContent = nl; $('#cntWish').textContent = nw;
  $('#tabLib').setAttribute('aria-selected', tab === 'lib' ? 'true' : 'false');
  $('#tabWish').setAttribute('aria-selected', tab === 'wish' ? 'true' : 'false');
  $('#btnShareWish').hidden = !shareable().length || !(tab === 'wish' || activeCount() || q);     // Desideri, oppure una selezione (preferiti, genere, ricerca...)
  updateActiveFilters();
  var fg = $('#fltGuess');
  fg.textContent = 'Da verificare · ' + g;
  fg.hidden = g === 0 && flt !== 'guess';
  fg.setAttribute('aria-pressed', flt === 'guess' ? 'true' : 'false');
  var allLoans = state.books.filter(function (b) { return !b.w && b.p; }).length;
  $('#cntLoan').textContent = allLoans;
  $('#fltLoan').setAttribute('aria-pressed', flt === 'loan' ? 'true' : 'false');
  var td = todoRows().length;
  var bt = $('#btnTodo');
  bt.hidden = td === 0;
  bt.textContent = 'Completa ' + td + (td === 1 ? ' libro' : ' libri') + ' con l\'ISBN';
}

/* ---------- azioni sulle righe ---------- */
function delBook(id) {
  var i = state.books.findIndex(function (b) { return b.id === id; });
  if (i < 0) return;
  var b = state.books[i], s = S[id];
  var active = s && (s.st === 'reading' || s.st === 'queued' || s.st === 'lookup' || s.st === 'search');
  state.books.splice(i, 1);
  delete S[id];
  var el = rowEl(id);
  if (el) el.remove();
  if (!tabBooks().length || settings.view === 'grid') renderList();
  touch(); updateSummary();
  if (active || !hasData(b)) { toast('Libro eliminato'); return; }
  toast('Libro eliminato', { label: 'Annulla', fn: function () {
    state.books.push(b); if (s) S[id] = s;
    renderList(); touch(); updateSummary();
  } });
}
function retryRow(id) {
  var s = S[id], b = get(id);
  if (!s || !b) return;
  clearTimeout(s.timer);
  var what = s.retry;
  s.err = ''; s.retry = null;
  if (what === 'lookup') { s.st = 'queued'; refreshRow(id); lookupPool(function () { return doLookup(id); }); }
  else if (what === 'text') {
    s.st = 'search'; refreshRow(id);
    var qs = L.buildQueries(s.lines || []);
    Promise.allSettled(qs.map(function (qq) { return L.searchText(qq, lookupOpts()); })).then(function (out) {
      if (!get(id)) return;
      var all = [], seen = {};
      out.forEach(function (r) { if (r.status === 'fulfilled') r.value.forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; all.push(c); } }); });
      if (out.every(function (r) { return r.status === 'rejected'; })) { s.st = 'error'; s.err = 'Le banche dati non rispondono. Riprova tra poco.'; s.retry = 'text'; refreshRow(id); return; }
      var ranked = L.rankCandidates(all, s.lines || []);
      if (!ranked.length) { applyOcrText(id); return; }
      if (L.strongMatch(ranked)) { applyCandidate(id, ranked[0]); return; }
      s.st = 'choose'; s.cands = ranked.slice(0, 6); refreshRow(id);
    });
  }
}

/* ---------- finestre ---------- */
function openIsbnSheet() {
  $('#isbnText').value = '';
  $('#isbnErr').hidden = true;
  $('#isbnResBox').hidden = true; $('#isbnRes').innerHTML = ''; titleSeq++;
  $('#isbnH').textContent = tab === 'wish' ? 'Aggiungi ai Desideri' : 'Titolo o ISBN';
  $('#isbnSheet').hidden = false;
  setTimeout(function () { $('#isbnText').focus(); }, 50);
}
/* ---------- ricerca per titolo (per esempio un libro consigliato da un amico) ---------- */
var titleSeq = 0, titleCands = [], titleText = '';
function looksLikeTitle(s) { return (String(s).replace(/isbn/ig, '').match(/[a-zàèéìòùç]/ig) || []).length >= 3; }
function whereTxt() { return tab === 'wish' ? 'ai Desideri' : 'alla Libreria'; }
async function searchTitle(text) {
  var my = ++titleSeq;
  titleText = text; titleCands = [];
  $('#isbnErr').hidden = true;
  $('#isbnResBox').hidden = false;
  $('#isbnResMsg').textContent = 'Cerco «' + text + '»…';
  $('#isbnRes').innerHTML = '';
  var asIs = $('#isbnAsIs');
  asIs.textContent = 'Aggiungi solo «' + (text.length > 40 ? text.slice(0, 38) + '…' : text) + '», senza cercare'; asIs.hidden = true;
  var res;
  try { res = await L.searchText(text, lookupOpts()); }
  catch (e) {
    if (my !== titleSeq) return;
    $('#isbnResMsg').textContent = e && e.code === 'rate' ? 'Google Libri è al limite di richieste: riprova tra poco, oppure aggiungi solo il titolo e completalo dopo.' : 'Non riesco a cercare: controlla la connessione. Puoi aggiungere solo il titolo e completarlo dopo.';
    asIs.hidden = false; return;
  }
  if (my !== titleSeq || $('#isbnSheet').hidden) return;
  // prima le edizioni italiane, poi quelle con l'ISBN; per il resto l'ordine di Google
  titleCands = res.map(function (c, i) { return { c: c, i: i }; }).sort(function (x, y) {
    return ((y.c.lang === 'it') - (x.c.lang === 'it')) || ((!!y.c.i) - (!!x.c.i)) || (x.i - y.i);
  }).map(function (x) { return x.c; }).slice(0, 8);
  $('#isbnRes').innerHTML = titleCands.map(function (c, i) {
    var have = (c.isbns || []).map(findByIsbn).filter(Boolean)[0];
    var badge = have ? '<span class="tag ' + (have.w ? 'loan' : 'warn') + '">' + (have.w ? 'Già nei Desideri' : 'Ce l\'hai già') + '</span>' : '';
    return '<li><button class="cand" data-i="' + i + '"><span class="cimg">' + (c.img ? '<img src="' + esc(c.img) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</span><span><b>' + esc(c.t) + '</b>' +
      '<span>' + esc(c.a || 'Autore non indicato') + '</span><span>' + esc([c.e, c.y].filter(Boolean).join(', ') || 'Editore e anno non indicati') + '</span>' + badge + '</span></button></li>';
  }).join('');
  $('#isbnResMsg').textContent = titleCands.length ? 'Tocca il libro giusto per aggiungerlo ' + whereTxt() + ':' : 'Non ho trovato libri per «' + text + '». Prova con meno parole, o aggiungi l\'autore.';
  asIs.hidden = false;
}
function addedToast(b) {
  var id = b.id;
  toast('Aggiunto ' + (b.w ? 'ai Desideri' : 'alla Libreria') + ': ' + (b.t || b.i), { label: 'Annulla', fn: function () {
    state.books = state.books.filter(function (x) { return x.id !== id; }); delete S[id]; renderList(); touch(); updateSummary();
  } });
}
function pickTitle(i) {
  var c = titleCands[i];
  if (!c) return;
  var code = L.toIsbn13(c.i);
  q = ''; $('#q').value = '';
  if (code) {
    var res = addIsbn(code);
    if (res.dup) { toast((res.dup.w ? 'È già nei Desideri: ' : 'Ce l\'hai già in Libreria: ') + (res.dup.t || code)); return; }
    $('#isbnSheet').hidden = true;
    if (res.moved) { openState[res.moved.id] = false; renderList(); updateSummary(); toast('Era nei Desideri: spostato in Libreria. ' + (res.moved.t || code)); return; }
    var b = res.book;
    b.t = c.t; b.a = c.a; if (c.img) b.img = c.img;           // si vede subito; il resto arriva dalle banche dati
    openState[b.id] = false;
    renderList(); updateSummary(); addedToast(b);
    return;
  }
  var nb = blankBook({ t: c.t, a: c.a, e: c.e, y: c.y, img: c.img || '', gen: c.gen || '', pg: c.pg || '' });
  state.books.push(nb); openState[nb.id] = false;
  $('#isbnSheet').hidden = true;
  touch(); renderList(); updateSummary(); addedToast(nb);
}
function addTitleAsIs() {
  var t = titleText.replace(/\s+/g, ' ').trim();
  if (!t) return;
  var nb = blankBook({ t: t.slice(0, 300) });
  state.books.push(nb); openState[nb.id] = false;
  $('#isbnSheet').hidden = true; q = ''; $('#q').value = '';
  touch(); renderList(); updateSummary(); addedToast(nb);
}
$('#isbnRes').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) pickTitle(+b.dataset.i); });
$('#isbnAsIs').addEventListener('click', addTitleAsIs);
$('#isbnText').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey && looksLikeTitle(e.target.value)) { e.preventDefault(); submitIsbn(); }
});
$('#isbnText').addEventListener('input', function () { $('#isbnErr').hidden = true; });

function submitIsbn() {
  var raw = $('#isbnText').value.trim();
  if (looksLikeTitle(raw) && !L.parseIsbnList(raw).valid.length) { searchTitle(raw); return; }
  var r = L.parseIsbnList($('#isbnText').value);
  var err = $('#isbnErr');
  if (!r.valid.length) {
    err.textContent = r.invalid.length ? 'Codice non valido: ' + r.invalid.slice(0, 3).join(', ') + '. Controlla le cifre.' : 'Scrivi un titolo o un codice ISBN.';
    err.hidden = false;
    return;
  }
  var added = 0, dupes = 0, moved = 0, dupIds = [];
  q = ''; flt = ''; $('#q').value = ''; setView('list');
  r.valid.forEach(function (code) {
    var res = addIsbn(code);
    if (res.dup) { dupes++; if (!res.dup.w && tab === 'lib') dupIds.push(res.dup.id); } else if (res.moved) moved++; else added++;
  });
  $('#isbnSheet').hidden = true;
  renderList(); updateSummary();
  var parts = [];
  if (added) parts.push(added + (added === 1 ? ' libro aggiunto' : ' libri aggiunti') + (tab === 'wish' ? ' ai Desideri' : ''));
  if (moved) parts.push(moved + (moved === 1 ? ' spostato dai Desideri alla Libreria' : ' spostati dai Desideri alla Libreria'));
  if (dupes) parts.push(dupes + (dupes === 1 ? ' già in elenco' : ' già in elenco'));
  if (r.invalid.length) parts.push(r.invalid.length + (r.invalid.length === 1 ? ' codice non valido' : ' codici non validi'));
  toast(parts.join(', ') + '.', dupIds.length ? { label: dupIds.length === 1 ? 'Aggiungi un\'altra copia' : 'Aggiungi come altre copie', fn: function () {
    dupIds.forEach(function (id) { addCopy(id, true); });
    renderList(); updateSummary(); toast(dupIds.length === 1 ? 'Aggiunta un\'altra copia.' : 'Aggiunte ' + dupIds.length + ' copie.');
  } } : null);
}
var pickId = null;
function openPick(id) {
  var s = S[id];
  if (!s || !s.cands) return;
  pickId = id;
  $('#pickList').innerHTML = s.cands.map(function (c, i) {
    return '<li><button class="cand" data-i="' + i + '"><span class="cimg">' + (c.img ? '<img src="' + esc(c.img) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</span><span><b>' + esc(c.t) + '</b>' +
      '<span>' + esc(c.a || 'Autore non indicato') + '</span><span>' + esc([c.e, c.y].filter(Boolean).join(' · ') || 'Editore e anno non indicati') + '</span></span></button></li>';
  }).join('');
  $('#pickSheet').hidden = false;
}
function closePick() { $('#pickSheet').hidden = true; pickId = null; }

/* ---------- export e backup ---------- */
function exportBooks() {
  var a = tabBooks().filter(hasData);
  return a.sort(sortBy === 'recent' ? function (x, y) { return x.ts - y.ts; } : cmpFor(sortBy));
}
function today() {
  var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function downloadBlob(name, data, type) {
  var blob = new Blob([data], { type: type });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
}
async function copyTSV() {
  var books = exportBooks();
  if (!books.length) { toast('L\'elenco è vuoto.'); return; }
  var text = L.buildTSV(books);
  try {
    await navigator.clipboard.writeText(text);
    toast('Copiato. Incollalo in Excel o Fogli Google.');
  } catch (e) {
    $('#copyBox').value = text;
    $('#copySheet').hidden = false;
    $('#copyBox').focus(); $('#copyBox').select();
  }
}
function fileBase() { return (tab === 'wish' ? 'desideri-' : 'libreria-') + today(); }
function saveCSV() {
  var books = exportBooks();
  if (!books.length) { toast('L\'elenco è vuoto.'); return; }
  downloadBlob(fileBase() + '.csv', L.buildCSV(books), 'text/csv;charset=utf-8');
  toast('File CSV scaricato.');
}
function saveXLSX() {
  var books = exportBooks();
  if (!books.length) { toast('L\'elenco è vuoto.'); return; }
  downloadBlob(fileBase() + '.xlsx', L.buildXLSX(books, tab === 'wish' ? 'Desideri' : 'Libreria'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  toast('File Excel scaricato: lo trovi nei Download.');
}
/* ---------- backup ---------- */
var backupReady = null;
function coverIds() { return Object.keys(coverURL).filter(function (id) { return !!get(id); }); }
/* Senza foto tue il backup e' pronto subito; con le foto va preparato prima (si leggono dal telefono), cosi' la condivisione parte al tocco. */
/* nel backup vanno anche worker SBN e chiave Google (in uso e salvati): ripristinando su un altro telefono tornano anche loro */
function backupCfg() { return { sbnUrl: settings.sbnUrl, gbKey: settings.gbKey, saved: { sbn: saved.sbn.slice(), key: saved.key.slice() } }; }
function backupData() { return coverIds().length ? backupReady : JSON.stringify({ app: 'catalogo-libri', v: 4, books: storable(), cfg: backupCfg() }); }
async function buildBackup() {
  var o = { app: 'catalogo-libri', v: 4, books: storable(), cfg: backupCfg() }, ids = coverIds();
  if (ids.length) {
    o.covers = {};
    var all = await idbAll();
    for (var i = 0; i < all.length; i++) if (ids.indexOf(all[i][0]) >= 0) o.covers[all[i][0]] = await blobToDataURL(all[i][1]);
  }
  return JSON.stringify(o);
}
function prepBackup() {
  var btns = [$('#btnShareBackup'), $('#btnBackup')], n = coverIds().length;
  if (!n) { btns.forEach(function (x) { x.disabled = false; }); return; }
  btns.forEach(function (x) { x.disabled = true; });
  $('#backupNote').textContent = 'Preparo il backup con ' + n + (n === 1 ? ' tua foto' : ' tue foto') + ' di copertina…';
  buildBackup().then(function (data) {
    backupReady = data;
    btns.forEach(function (x) { x.disabled = false; });
    $('#backupNote').textContent = 'Il backup comprende ' + n + (n === 1 ? ' tua foto' : ' tue foto') + ' di copertina (' + (data.length / 1048576).toFixed(1).replace('.', ',') + ' MB).';
  }, function () { btns.forEach(function (x) { x.disabled = false; }); $('#backupNote').textContent = 'Non riesco a leggere le tue foto: il backup comprenderà solo i dati dei libri.'; backupReady = JSON.stringify({ app: 'catalogo-libri', v: 4, books: storable(), cfg: backupCfg() }); });
}
function markBackup() { settings.lastBackup = Date.now(); saveSettings(); updateBackupInfo(); if (noticeKind === 'backup') $('#notice').hidden = true; }
function backup() {
  if (!storable().length) { toast('L\'elenco è vuoto: non c\'è niente da salvare.'); return; }
  if (!backupData()) { openExport(); toast('Preparo il backup con le tue foto: riprova tra un attimo.'); return; }
  downloadBlob('next-libris-backup-' + today() + '.json', backupData(), 'application/json');
  markBackup();
  toast('Backup scaricato. Tienine una copia anche fuori dal telefono (Drive, email).');
}
/* Condivide il file di backup (Drive, Gmail, WhatsApp…). Chrome condivide solo alcuni tipi di file: se il .json non e' ammesso
   lo mando come .txt (il contenuto e' identico e «Ripristina» lo accetta). Se la condivisione non c'e', scarico il file. */
async function shareBackup() {
  if (!storable().length) { toast('L\'elenco è vuoto: non c\'è niente da salvare.'); return; }
  var data = backupData(), base = 'next-libris-backup-' + today(), file = null;
  if (!data) { openExport(); toast('Preparo il backup con le tue foto: riprova tra un attimo.'); return; }
  try {
    var cands = [new File([data], base + '.json', { type: 'application/json' }), new File([data], base + '.txt', { type: 'text/plain' })];
    for (var i = 0; i < cands.length && !file; i++) if (navigator.canShare && navigator.canShare({ files: [cands[i]] })) file = cands[i];
  } catch (e) { file = null; }
  if (file) {
    try {
      await navigator.share({ files: [file], title: 'Backup Next Libris', text: 'Backup di Next Libris del ' + L.itDate(today()) });
      markBackup(); toast('Backup condiviso.'); return;
    } catch (e) {
      if (e && e.name === 'AbortError') { toast('Condivisione annullata: il backup non è stato salvato.'); return; }
    }
  }
  backup();
}
function updateBackupInfo() {
  var n = storable().length;
  $('#backupInfo').textContent = 'Ultimo backup: ' + L.agoText(settings.lastBackup) + ' · ' + n + (n === 1 ? ' libro' : ' libri') + ' salvati solo su questo telefono.';
}
/* Promemoria: con almeno 10 libri, se ci sono modifiche non salvate in un backup da piu' di 14 giorni (o mai). */
function checkBackupNag() {
  if (scanning) return;
  var n = storable().length, now = Date.now(), DAY = 86400000;
  var due = n >= 10 && state.updated > settings.lastBackup && now - Math.max(settings.lastBackup, settings.snooze) > 14 * DAY;
  if (!due) { if (noticeKind === 'backup') { $('#notice').hidden = true; noticeKind = ''; } return; }
  if (noticeKind === 'backup' || !$('#notice').hidden) return;
  notice('Ultimo backup: ' + L.agoText(settings.lastBackup) + '. I ' + n + ' libri sono salvati solo su questo telefono: se cambi telefono o cancelli i dati di Chrome li perdi.',
    'Fai il backup', function () { if (coverIds().length) openExport(); else shareBackup(); }, function () { settings.snooze = Date.now(); saveSettings(); }, 'backup');
}
/* dal backup: worker e chiave tornano tra i salvati; se qui mancano, li rimette in uso. Restituisce cosa ha rimesso. */
function restoreCfg(c) {
  if (!c || typeof c !== 'object') return '';
  var okW = function (v) { v = cleanWorker(v); return /^https:\/\/[^\s/]+\.[^\s]+$/.test(v) ? v : ''; };
  var okK = function (v) { return typeof v === 'string' ? v.replace(/\s+/g, '') : ''; };
  var sv = c.saved || {}, put = [];
  ['sbn', 'key'].forEach(function (k) {
    var list = (Array.isArray(sv[k]) ? sv[k] : []).concat([k === 'sbn' ? c.sbnUrl : c.gbKey]).map(k === 'sbn' ? okW : okK).filter(Boolean);
    list.forEach(function (v) { if (saved[k].indexOf(v) < 0 && saved[k].length < 4) saved[k].push(v); });
  });
  ls.set(LS_SAVED, JSON.stringify(saved));
  var w = okW(c.sbnUrl), k2 = okK(c.gbKey);
  if (w && !settings.sbnUrl) { setSvc('sbn', w); put.push('il worker SBN'); }
  if (k2 && !settings.gbKey) { setSvc('key', k2); put.push('la chiave Google'); }
  renderSvc();
  return put.join(' e ');
}
function restore(file) {
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var d = JSON.parse(String(rd.result));
      if (d && d.share) {                                  // non e' un backup: e' una lista ricevuta da un amico
        var sh = L.parseShare(d.share);
        if (!sh) throw new Error('lista');
        $('#exportSheet').hidden = true; openImport(sh); return;
      }
      var incoming = (d.books || []).map(cleanBook).filter(Boolean);
      var have = {};
      state.books.forEach(function (b) { have[b.id] = 1; });
      var n = 0;
      incoming.forEach(function (b) { if (!have[b.id]) { state.books.push(b); n++; } });
      if (!incoming.length && !Array.isArray(d.books)) throw new Error('formato');
      var nc = 0;
      if (d.covers && typeof d.covers === 'object') Object.keys(d.covers).forEach(function (id) {
        if (get(id) && !coverURL[id] && /^data:image\//.test(d.covers[id])) { nc++; saveCoverData(id, d.covers[id]); }
      });
      var cfg = restoreCfg(d.cfg);
      touch(); renderList(); updateSummary();
      toast(n + (n === 1 ? ' libro ripristinato' : ' libri ripristinati') + (nc ? ', ' + nc + ' foto di copertina' : '') + '.' +
        (cfg ? ' Torn' + (/ e /.test(cfg) ? 'ano' : 'a') + ' in uso anche ' + cfg + '.' : ''));
    } catch (e) { toast('Il file non è un backup né una lista di Next Libris.'); }
  };
  rd.readAsText(file);
}

/* ---------- copertine: le tue foto (salvate sul telefono) e versioni grandi ---------- */
var coverURL = {};          // id libro -> immagine della tua foto (dal database del telefono)
var coverPhotoId = null, noBig = {}, probing = {};
var idbP = null;
function idb() {
  if (idbP) return idbP;
  idbP = new Promise(function (res, rej) {
    if (!window.indexedDB) { rej(new Error('IndexedDB non disponibile')); return; }
    var r = indexedDB.open('catalogo-libri', 1);
    r.onupgradeneeded = function () { r.result.createObjectStore('covers'); };
    r.onsuccess = function () { res(r.result); };
    r.onerror = function () { rej(r.error); };
  });
  idbP.catch(function () { idbP = null; });
  return idbP;
}
function idbDo(mode, fn) {
  return idb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction('covers', mode);
      fn(tx.objectStore('covers'));
      tx.oncomplete = function () { res(); };
      tx.onerror = tx.onabort = function () { rej(tx.error || new Error('db')); };
    });
  });
}
function idbAll() {
  return idb().then(function (db) {
    return new Promise(function (res, rej) {
      var out = [], tx = db.transaction('covers', 'readonly'), rq = tx.objectStore('covers').openCursor();
      rq.onsuccess = function () { var c = rq.result; if (c) { out.push([String(c.key), c.value]); c.continue(); } };
      tx.oncomplete = function () { res(out); };
      tx.onerror = function () { rej(tx.error); };
    });
  });
}
function blobToDataURL(blob) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result)); }; r.onerror = rej; r.readAsDataURL(blob); }); }
function askPersist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(function (p) { if (!p) navigator.storage.persist(); }); } catch (e) {} }
async function loadCovers() {
  try {
    var all = await idbAll(), keep = 0, gone = [];
    all.forEach(function (kv) {
      if (get(kv[0])) { coverURL[kv[0]] = URL.createObjectURL(kv[1]); keep++; }
      else gone.push(kv[0]);                                   // libro eliminato: tolgo anche la foto
    });
    if (gone.length) idbDo('readwrite', function (st) { gone.forEach(function (k) { st.delete(k); }); }).catch(function () {});
    if (keep) { syncThumbs(); renderList(); }
  } catch (e) { /* senza database le tue foto non si possono salvare: restano le copertine scaricate */ }
}
async function saveCover(id, blob) {
  await idbDo('readwrite', function (st) { st.put(blob, id); });
  if (coverURL[id]) URL.revokeObjectURL(coverURL[id]);
  coverURL[id] = URL.createObjectURL(blob);
  askPersist();
  touch(); syncThumbs(); refreshRow(id);
}
/* foto -> JPEG di al massimo 900 px, salvato sul telefono */
async function saveCoverCanvas(id, canvas) {
  var c = scaled(canvas, 900);
  var blob = await new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.82); });
  if (!blob) throw new Error('jpeg');
  await saveCover(id, blob);
}
function saveCoverData(id, du) {
  var img = new Image();
  img.onload = function () {
    var c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    saveCoverCanvas(id, c).catch(function () {});
  };
  img.src = du;
}
async function removeCover(id) {
  await idbDo('readwrite', function (st) { st.delete(id); });
  if (coverURL[id]) URL.revokeObjectURL(coverURL[id]);
  delete coverURL[id];
  touch(); syncThumbs(); refreshRow(id);
}
/* Prova un'immagine: vale come copertina grande se arriva, e' larga almeno 250 px e ha le proporzioni di un libro. */
function testImage(u) {
  return new Promise(function (res) {
    var im = new Image(), t = setTimeout(function () { res(false); }, 12000);
    im.referrerPolicy = 'no-referrer';
    im.onload = function () { clearTimeout(t); var w = im.naturalWidth, r = im.naturalHeight / Math.max(1, w); res(w >= 250 && r > 1.05 && r < 2.1); };
    im.onerror = function () { clearTimeout(t); res(false); };
    im.src = u;
  });
}
/* Cerca la copertina grande: prima quella ufficiale di Google (scheda completa del volume), poi Open Library. La ricorda nel libro. */
function probeCover(id) {
  var b = get(id);
  if (!b || b.imgL || coverURL[id] || b.nb || !(b.img || L.toIsbn13(b.i))) return Promise.resolve(!!(b && (b.imgL || coverURL[id])));
  if (probing[id]) return probing[id];
  probing[id] = (async function () {
    var cands = [], gid = L.googleVolumeId(b.img), sure = true;
    if (gid && navigator.onLine !== false) {
      sure = false;
      try {
        var j = await L.getJson(apiFetch, 'https://www.googleapis.com/books/v1/volumes/' + encodeURIComponent(gid) + '?fields=volumeInfo/imageLinks' + (settings.gbKey ? '&key=' + encodeURIComponent(settings.gbKey) : ''), { waits: [], timeout: 10000 });
        var gu = L.bestGoogleImage(j);
        if (gu) cands.push(gu);
        sure = true;
      } catch (e) { /* limite o rete: resta Open Library, e riproveremo un'altra volta */ }
    }
    cands = cands.concat(L.coverCandidates(b.img, b.i));
    for (var i = 0; i < cands.length; i++) {
      if (await testImage(cands[i])) {
        var x = get(id);
        if (x && !x.imgL) { x.imgL = cands[i]; x.nb = false; touch(); refreshRow(id); }
        return true;
      }
    }
    var y = get(id);
    if (y && sure && navigator.onLine !== false) { y.nb = true; touch(); }       // non esiste: non lo richiedo piu'
    return false;
  })();
  return probing[id].then(function (ok) { delete probing[id]; if (!ok) noBig[id] = true; return ok; });
}
/* ---------- libro senza copertina: prima di aprire la fotocamera la cerco online ----------
   1) stessa edizione (stesso ISBN): Open Library e Google Libri;
   2) altrimenti la copertina di un'altra edizione: Open Library (opera dell'ISBN) e Google Libri per titolo e autore.
   Tutto entro pochi secondi: Chrome lascia aprire la fotocamera solo poco dopo il tocco. */
var covSearching = {}, covNone = {};
function testImg(u, minW, ms) {
  return new Promise(function (res) {
    var im = new Image(), t = setTimeout(function () { im.onload = im.onerror = null; res(0); }, ms || 3000);
    im.referrerPolicy = 'no-referrer';
    im.onload = function () { clearTimeout(t); var w = im.naturalWidth, r = im.naturalHeight / Math.max(1, w); res(w >= (minW || 80) && r > 1.05 && r < 2.1 ? w : 0); };
    im.onerror = function () { clearTimeout(t); res(0); };
    im.src = u;
  });
}
function tkey(s) { return L.norm(s).replace(/[^a-z0-9]+/g, ' ').trim(); }
function gThumb(v) { var l = v && v.imageLinks; var u = l && (l.thumbnail || l.smallThumbnail); return u ? String(u).replace(/^http:\/\//i, 'https://').replace(/&edge=curl/g, '') : ''; }
async function findCover(b, budget, sameOnly) {
  var deadline = Date.now() + (budget || 3500);
  function left() { return Math.max(300, deadline - Date.now()); }
  var isbn = L.toIsbn13(b.i), i10 = isbn ? L.isbn13to10(isbn) : '', useG = googleLeft(false);
  function gq(q, n) {
    return L.getJson(apiFetch, 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(q) + '&maxResults=' + n +
      '&fields=items(volumeInfo(title,authors,language,publisher,industryIdentifiers,imageLinks))' + (settings.gbKey ? '&key=' + encodeURIComponent(settings.gbKey) : ''), { waits: [], timeout: left() });
  }
  async function img(u, rank, alt, minW) { var w = u ? await testImg(u, minW || 80, left()) : 0; return w ? { url: u, big: w >= 250, alt: alt, rank: rank } : null; }
  function safe(p) { return p.then(function (x) { return x; }, function () { return null; }); }
  var jobs = [];
  if (isbn) {
    [isbn, i10].filter(Boolean).forEach(function (x) { jobs.push(safe(img('https://covers.openlibrary.org/b/isbn/' + x + '-L.jpg?default=false', 1, false))); });
    if (useG) jobs.push(safe(gq('isbn:' + isbn, 3).then(function (j) {
      var v = ((j && j.items) || []).map(function (it) { return it.volumeInfo; }).filter(function (v) { return gThumb(v); })[0];
      return v ? img(gThumb(v), 2, false, 60) : null;
    })));
    jobs.push(safe(L.getJson(fetch, 'https://openlibrary.org/search.json?q=' + encodeURIComponent('isbn:' + isbn) + '&fields=cover_i&limit=1', { waits: [], timeout: left() }).then(function (j) {
      var c = j && j.docs && j.docs[0] && j.docs[0].cover_i;
      return c ? img('https://covers.openlibrary.org/b/id/' + c + '-L.jpg', 3, true) : null;
    })));
  }
  var tk = tkey(b.t), sur = tkey(String(b.a || '').split(/[,;]| e /)[0]).split(' ').pop() || '';
  if (!sameOnly && useG && tk.length >= 3) jobs.push(safe(gq('intitle:"' + b.t + '"' + (sur ? ' inauthor:' + sur : ''), 10).then(function (j) {
    var ok = ((j && j.items) || []).map(function (it) { return it.volumeInfo || {}; }).filter(function (v) {
      var vt = tkey(v.title);
      if (!gThumb(v) || !vt || !(vt.indexOf(tk) === 0 || tk.indexOf(vt) === 0)) return false;
      return !sur || (v.authors || []).some(function (a) { return tkey(a).indexOf(sur) >= 0; });
    });
    var same = ok.filter(function (v) { return isbn && (v.industryIdentifiers || []).some(function (x) { return L.toIsbn13(x.identifier) === isbn; }); })[0];
    if (same) return img(gThumb(same), 2, false, 60);
    var pub = tkey(b.e);
    ok.sort(function (x, y) {
      function sc(v) { return (v.language === 'it' ? 2 : 0) + (pub && tkey(v.publisher).indexOf(pub) >= 0 ? 1 : 0); }
      return sc(y) - sc(x);
    });
    return ok[0] ? img(gThumb(ok[0]), 4, true, 60) : null;
  })));
  // la migliore: stessa edizione prima di un'altra, grande prima di piccola; una grande della stessa edizione chiude subito la ricerca
  return new Promise(function (res) {
    var best = null, pending = jobs.length;
    if (!pending) { res(null); return; }
    jobs.forEach(function (p) {
      p.then(function (x) {
        if (x && (!best || x.rank < best.rank || (x.rank === best.rank && x.big && !best.big))) best = x;
        if (--pending === 0 || (best && !best.alt && best.big)) res(best);
      });
    });
  });
}
function openCoverCamera(id) { coverPhotoId = id; $('#fileCover').click(); }
var covAskId = null;
function askCoverPhoto(id, msg) { covAskId = id; $('#covMsg').textContent = msg; $('#toast').hidden = true; $('#covSheet').hidden = false; }
function closeCovAsk() { $('#covSheet').hidden = true; covAskId = null; }
$('#covShot').addEventListener('click', function () { var id = covAskId; closeCovAsk(); if (id) openCoverCamera(id); });
$('#covLater').addEventListener('click', closeCovAsk);
$('#covSheet').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeCovAsk(); });
async function coverTap(id) {
  var b = get(id);
  if (!b || covSearching[id]) return;
  if (navigator.onLine === false) { askCoverPhoto(id, 'Sei senza rete: non posso cercarla online. Puoi fotografarla tu.'); return; }
  covSearching[id] = true; refreshRow(id);
  var r = null;
  try { r = await findCover(b, 3500); } catch (e) {}
  delete covSearching[id];
  var x = get(id);
  if (!x) return;
  if (r && !smallImg(x)) {
    var before = { img: x.img, imgL: x.imgL, nb: x.nb };
    x.img = r.url; if (r.big) x.imgL = r.url; x.nb = false;
    touch(); syncThumbs(); refreshRow(id);
    if (r.alt) toast('Ho trovato la copertina di un\'altra edizione: controlla che vada bene.', { label: 'Non è questa', fn: function () {
      var y = get(id); if (y) { Object.assign(y, before); touch(); syncThumbs(); refreshRow(id); } covNone[id] = true; openCoverCamera(id); } });
    else toast('Copertina trovata.', { label: 'Usa una mia foto', fn: function () { openCoverCamera(id); } });
    return;
  }
  refreshRow(id);
  askCoverPhoto(id, 'Non ho trovato online la copertina di «' + (x.t || 'ISBN ' + x.i) + '». Puoi fotografarla tu.');
}
async function improveCovers() {
  var todo = state.books.filter(function (b) { return !b.imgL && !coverURL[b.id] && !b.nb && (b.img || L.toIsbn13(b.i)); });
  if (!todo.length) { toast('Non ci sono copertine da migliorare: per gli altri libri ho già controllato che non ne esista una più grande.'); return; }
  if (!googleLeft(true)) { toast('Le ricerche di Google per oggi le tengo per i libri nuovi: riprova domani.'); return; }
  if (navigator.onLine === false) { toast('Sei offline. Riprova quando c\'è connessione.'); return; }
  var btn = $('#btnCovers'), done = 0, found = 0;
  btn.disabled = true;
  await Promise.all(todo.map(function (b) {
    return coverPool(async function () {
      delete noBig[b.id];
      if (await probeCover(b.id)) found++;
      btn.textContent = 'Cerco le copertine… ' + (++done) + '/' + todo.length;
    });
  }));
  btn.disabled = false; btn.textContent = 'Cerca copertine più grandi';
  renderList();
  toast('Trovate ' + found + ' copertine grandi su ' + todo.length + '.' + (found < todo.length ? ' Per le altre puoi usare una tua foto: tocca la copertina e poi «Usa una mia foto».' : ''));
}

/* ---------- copertina in grande ---------- */
var lbToken = 0, lbPushed = false, lbId = null;
function lbButtons(b) {
  var local = !!coverURL[b.id];
  $('#lbPhoto').textContent = local ? 'Rifai la foto' : 'Usa una mia foto';
  $('#lbReset').hidden = !local;
  $('#lbReset').textContent = (b.imgL || b.img) ? 'Torna alla copertina scaricata' : 'Togli la mia foto';
}
function openCover(id) {
  var b = get(id);
  if (!b) return;
  var src = bigImg(b);
  if (!src) return;
  lbId = id;
  var tok = ++lbToken, img = $('#lbImg');
  img.src = src;
  $('#lbCap').textContent = [b.t || 'Senza titolo', b.a].filter(Boolean).join(' — ');
  lbButtons(b);
  var tryBig = !coverURL[id] && !b.imgL && !noBig[id] && !b.nb && !!(b.img || L.toIsbn13(b.i));
  $('#lbNote').textContent = tryBig ? 'Cerco un\'immagine più grande…'
    : (!coverURL[id] && !b.imgL && (b.img || b.nb) ? 'Non esiste una versione più grande: per una copertina migliore usa una tua foto.' : '');
  $('#lightbox').hidden = false;
  if (!lbPushed) { try { history.pushState({ lb: 1 }, ''); lbPushed = true; } catch (e) {} }
  $('#lbClose').focus({ preventScroll: true });
  if (tryBig) probeCover(id).then(function (ok) {
    if (tok !== lbToken) return;
    var x = get(id);
    if (ok && x && x.imgL && !coverURL[id]) { img.src = x.imgL; $('#lbNote').textContent = ''; }
    else if (!coverURL[id]) $('#lbNote').textContent = 'Non esiste una versione più grande: per una copertina migliore usa una tua foto.';
  });
}
function closeCover(fromPop) {
  if ($('#lightbox').hidden) return;
  lbToken++;
  $('#lightbox').hidden = true;
  $('#lbImg').removeAttribute('src');
  if (lbPushed && !fromPop) { lbPushed = false; try { history.back(); } catch (e) {} }
  lbPushed = false;
}
$('#lbClose').addEventListener('click', function () { closeCover(false); });
$('#lbPhoto').addEventListener('click', function (e) { e.stopPropagation(); coverPhotoId = lbId; $('#fileCover').click(); });
$('#lbReset').addEventListener('click', async function (e) {
  e.stopPropagation();
  var id = lbId, b = get(id);
  if (!b) return;
  try { await removeCover(id); } catch (err) { toast('Non riesco a togliere la foto.'); return; }
  var src = bigImg(b);
  if (!src) { closeCover(false); toast('Foto tolta.'); return; }
  $('#lbImg').src = src; $('#lbNote').textContent = ''; lbButtons(b);
});
bindFile('#fileCover', async function (f) {
  var id = coverPhotoId; coverPhotoId = null;
  if (!id || !get(id)) return;
  try {
    var canvas = await loadCanvas(f[0], 1400);
    await saveCoverCanvas(id, canvas);
    if (!$('#lightbox').hidden && lbId === id) { $('#lbImg').src = coverURL[id]; $('#lbNote').textContent = '✓ Copertina salvata sul telefono (e nel backup).'; lbButtons(get(id)); }
    else toast('Copertina salvata sul telefono (e nel backup).');
  } catch (e) { toast('Non riesco a salvare la foto sul telefono.'); }
});
$('#btnCovers').addEventListener('click', improveCovers);
$('#lightbox').addEventListener('click', function (e) { if (e.target === e.currentTarget || e.target.id === 'lbCap' || e.target.id === 'lbNote') closeCover(false); });
window.addEventListener('popstate', function () { if (!$('#lightbox').hidden) { lbPushed = false; closeCover(true); } });

function setRead(id, what, v) {
  var b = get(id);
  if (!b) return;
  if (what === 'rs') {
    b.rs = b.rs === v ? '' : v;
    if (b.rs === 'ok' && !b.rd) b.rd = today();
  } else {
    var n = parseInt(v, 10) || 0;
    b.rt = b.rt === n ? 0 : n;
  }
  touch(); refreshRow(id); updateSummary();
  var el = rowEl(id), f = el && el.querySelector('[data-act="' + what + '"][data-v="' + v + '"]');
  if (f) f.focus({ preventScroll: true });
}

/* ---------- pannello Filtri (a sinistra): si apre dal pulsante o trascinando il pollice dal bordo sinistro verso destra ---------- */
var NONE = '\u0001';
var READ_TXT = { da: 'Da leggere', in: 'In lettura', ok: 'Letti', no: 'Non indicato' };
var FLT_TXT = { fav: 'Preferiti', loan: 'In prestito', gone: 'Venduti, regalati, smarriti', guess: 'Da verificare', dup: 'Copie e doppioni' };
function facetKey(s) { var k = L.norm(String(s || '').trim().replace(/\s+/g, ' ')); return k || NONE; }
/* scaffali o generi del tab corrente: chiave normalizzata, nome piu' usato, quanti libri */
function facets(field) {
  var m = {};
  tabBooks().forEach(function (b) {
    var k = facetKey(b[field]);
    var e = m[k] || (m[k] = { k: k, n: 0, names: {} });
    e.n++;
    if (k !== NONE) e.names[b[field].trim()] = (e.names[b[field].trim()] || 0) + 1;
  });
  return Object.keys(m).map(function (k) {
    var e = m[k], best = '';
    Object.keys(e.names).forEach(function (s) { if (!best || e.names[s] > e.names[best]) best = s; });
    return { k: k, n: e.n, name: k === NONE ? '' : best };
  });
}
function facetName(field, k) { if (k === NONE) return field === 'sh' ? 'senza scaffale' : 'senza genere'; var f = facets(field).find(function (x) { return x.k === k; }); return f ? f.name : ''; }
var frFlt = '';                 // filtro «ricevuti da»
function activeCount() { return (flt ? 1 : 0) + (frFlt ? 1 : 0) + (readFlt && tab === 'lib' ? 1 : 0) + (shFlt ? 1 : 0) + (genFlt ? 1 : 0) + (autFlt ? 1 : 0) + (edFlt ? 1 : 0); }
function authorsOf(b) { return String(b.a || '').split(/\s*[,;]\s*/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 1; }); }
function clearFilters() {
  flt = ''; readFlt = ''; shFlt = ''; genFlt = ''; autFlt = ''; autName = ''; edFlt = ''; frFlt = '';
  q = ''; $('#q').value = ''; collapseCards();
  renderList(); updateSummary();
  if (drawerOpen) renderDrawer();
}
function updateActiveFilters() {
  var o = '';
  function chip(k, txt) { o += '<button class="chip on" data-clear="' + k + '" aria-label="Togli il filtro ' + esc(txt) + '">' + esc(txt) + '<span class="x" aria-hidden="true">×</span></button>'; }
  if (flt === 'gone' || flt === 'dup' || flt === 'fav') chip('flt', FLT_TXT[flt]);
  if (frFlt) chip('fr', 'Ricevuti da ' + frFlt);
  if (readFlt && tab === 'lib') chip('read', READ_TXT[readFlt]);
  if (shFlt) chip('sh', shFlt === NONE ? 'Senza scaffale' : 'Scaffale: ' + facetName('sh', shFlt));
  if (genFlt) chip('gen', genFlt === NONE ? 'Senza genere' : 'Genere: ' + facetName('gen', genFlt));
  if (autFlt) chip('aut', 'Autore: ' + autName);
  if (edFlt) chip('ed', 'Casa editrice: ' + facetName('e', edFlt));
  $('#activeFlt').innerHTML = o;
  var n = activeCount(), bd = $('#fltBadge');
  bd.hidden = !n; bd.textContent = n;
  $('#btnFilters').setAttribute('aria-pressed', n ? 'true' : 'false');
  $('#edgeTab').classList.toggle('on', !!n);
  $('#edgeTab').setAttribute('aria-label', 'Apri i filtri' + (n ? ' (' + n + (n === 1 ? ' attivo)' : ' attivi)') : ''));
  $('#btnFilters').setAttribute('aria-label', 'Filtri e ordine' + (n ? ' (' + n + (n === 1 ? ' filtro attivo)' : ' filtri attivi)') : ''));
}
$('#activeFlt').addEventListener('click', function (e) {
  var x = e.target.closest('[data-clear]');
  if (!x) return;
  var k = x.dataset.clear;
  if (k === 'flt') flt = ''; else if (k === 'read') readFlt = ''; else if (k === 'sh') shFlt = ''; else if (k === 'gen') genFlt = '';
  else if (k === 'aut') { autFlt = ''; autName = ''; } else if (k === 'ed') edFlt = ''; else if (k === 'fr') frFlt = '';
  collapseCards(); renderList(); updateSummary();
});
function renderDrawer() {
  var books = tabBooks(), lib = tab === 'lib', o = '';
  function opt(group, val, label, n, cur) {
    return '<button type="button" class="dopt" data-g="' + group + '" data-v="' + esc(val) + '" aria-pressed="' + (cur === val ? 'true' : 'false') + '"><span>' + esc(label) + '</span>' + (n != null ? '<span class="n">' + n + '</span>' : '') + '</button>';
  }
  var cnt = { fav: 0, loan: 0, gone: 0, guess: 0, dup: 0 }, dm = L.analyzeDups(state.books), frs = {};
  books.forEach(function (b) { if (b.fav) cnt.fav++; if (b.fr) frs[b.fr] = (frs[b.fr] || 0) + 1; if (b.p) cnt.loan++; if (b.xs) cnt.gone++; if (b.g.length) cnt.guess++; if (dm[b.id]) cnt.dup++; });
  o += '<h3>Mostra</h3><div class="dlist">' + opt('flt', '', lib ? 'Tutti i libri' : 'Tutti i desideri', books.length, flt);
  (lib ? ['fav', 'loan', 'gone', 'guess', 'dup'] : ['guess', 'dup']).forEach(function (k) {
    if (cnt[k] || flt === k || k === 'loan' || k === 'fav') o += opt('flt', k, FLT_TXT[k], cnt[k], flt);
  });
  o += '</div>';
  if (lib) {
    var rc = { da: 0, in: 0, ok: 0, no: 0 };
    books.forEach(function (b) { rc[b.rs || 'no']++; });
    o += '<h3>Lettura</h3><div class="dlist">' + opt('read', '', 'Tutti', null, readFlt);
    ['da', 'in', 'ok', 'no'].forEach(function (k) { if (rc[k] || readFlt === k || k !== 'no') o += opt('read', k, READ_TXT[k], rc[k], readFlt); });
    o += '</div>';
  }
  [['sh', 'Scaffale', 'Senza scaffale', shFlt], ['gen', 'Genere', 'Senza genere', genFlt]].forEach(function (f) {
    var list = facets(f[0]), named = list.filter(function (x) { return x.k !== NONE; });
    if (!named.length && !f[3]) return;
    named.sort(f[0] === 'sh' ? function (x, y) { return coll.compare(x.name, y.name); } : function (x, y) { return y.n - x.n || coll.compare(x.name, y.name); });
    var none = list.find(function (x) { return x.k === NONE; });
    o += '<h3>' + f[1] + '</h3><div class="dpills">' + named.concat(none ? [none] : []).map(function (x) {
      return '<button type="button" class="dpill' + (x.k === NONE ? ' none-sh' : '') + '" data-g="' + f[0] + '" data-v="' + esc(x.k) + '" aria-pressed="' + (f[3] === x.k ? 'true' : 'false') + '">' + esc(x.k === NONE ? f[2] : x.name) + '<span class="n">' + x.n + '</span></button>';
    }).join('') + '</div>';
  });
  var frNames = Object.keys(frs).sort(coll.compare);
  if (frNames.length || frFlt) o += '<h3>Ricevuti da</h3><div class="dpills">' + frNames.map(function (n) {
    return '<button type="button" class="dpill" data-g="fr" data-v="' + esc(n) + '" aria-pressed="' + (frFlt === n ? 'true' : 'false') + '">' + esc(n) + '<span class="n">' + frs[n] + '</span></button>';
  }).join('') + '</div>';
  var pre = '';
  if (autFlt) pre += '<p class="dq"><span>Autore: ' + esc(autName) + '</span><button type="button" class="ico" data-g="aut" data-v="" aria-label="Togli il filtro autore">×</button></p>';
  if (edFlt) pre += '<p class="dq"><span>Casa editrice: ' + esc(facetName('e', edFlt)) + '</span><button type="button" class="ico" data-g="ed" data-v="" aria-label="Togli il filtro casa editrice">×</button></p>';
  o = pre + o;
  var body = $('#drawerBody'), st = body.scrollTop;
  $('#drawerFlt').innerHTML = o;
  body.scrollTop = st;
  $('#sort').value = sortBy;
  $('#drawerHint').hidden = !!settings.swiped;
  updateDrawerFoot();
}
function updateDrawerFoot() {
  var n = visible().length;
  $('#drawerShow').textContent = n === 1 ? 'Mostra 1 libro' : 'Mostra ' + n + ' libri';
  $('#drawerReset').disabled = !activeCount() && !q;
  $('#drawerQ').hidden = !q;
  $('#drawerQTxt').textContent = 'Ricerca: «' + q + '»';
}
$('#drawerFlt').addEventListener('click', function (e) {
  var x = e.target.closest('[data-g]');
  if (!x) return;
  var g = x.dataset.g, v = x.dataset.v;
  if (g === 'flt') flt = flt === v ? '' : v;
  else if (g === 'read') readFlt = readFlt === v ? '' : v;
  else if (g === 'sh') shFlt = shFlt === v ? '' : v;
  else if (g === 'gen') genFlt = genFlt === v ? '' : v;
  else if (g === 'fr') frFlt = frFlt === v ? '' : v;
  else if (g === 'aut') { autFlt = ''; autName = ''; }
  else if (g === 'ed') edFlt = '';
  collapseCards(); renderList(); updateSummary(); renderDrawer();
});

var drawerOpen = false, drawerPushed = false, drawerTimer = null, drawerReturn = null;
var drawerEl = $('#drawer'), scrimEl = $('#drawerScrim');
function drawerWidth() { return drawerEl.getBoundingClientRect().width || 320; }
function showDrawerEls() {
  clearTimeout(drawerTimer);
  drawerEl.hidden = false; scrimEl.hidden = false; drawerEl.removeAttribute('inert');
}
/* posizione durante il trascinamento: px = quanto pannello si vede */
function dragDrawer(px) {
  var w = drawerWidth();
  px = Math.max(0, Math.min(w, px));
  drawerEl.style.transition = 'none'; scrimEl.style.transition = 'none';
  drawerEl.style.transform = 'translateX(' + (px - w) + 'px)';
  scrimEl.style.opacity = String(px / w);
}
function releaseDrawerStyles() {
  drawerEl.style.transition = ''; scrimEl.style.transition = '';
  drawerEl.style.transform = ''; scrimEl.style.opacity = '';
}
var drawerTab = 'flt';
function setDrawerTab(t) {
  drawerTab = t === 'opt' ? 'opt' : 'flt';
  $('#dtFlt').setAttribute('aria-selected', drawerTab === 'flt' ? 'true' : 'false');
  $('#dtOpt').setAttribute('aria-selected', drawerTab === 'opt' ? 'true' : 'false');
  $('#drawerFilters').hidden = drawerTab !== 'flt';
  $('#drawerOpts').hidden = drawerTab !== 'opt';
  $('#drawerFoot').hidden = drawerTab !== 'flt';
  if (drawerTab === 'opt') { $('#optBackupHint').textContent = backupHint(); renderVersion(); checkVersion(); }
  $('#drawerBody').scrollTop = 0;
}
function backupHint() {
  var last = settings.lastBackup;
  return last ? 'Ultimo backup: ' + new Date(last).toLocaleDateString('it-IT') + '.' : 'Non hai ancora fatto un backup: i libri sono solo su questo telefono.';
}
function openDrawer(t, reuse) {
  if (t === 'opt' || t === 'flt') setDrawerTab(t);
  else if (!drawerOpen) setDrawerTab('flt');
  if (reuse) { try { history.replaceState({ drawer: 1 }, ''); drawerPushed = true; } catch (e) {} }
  if (!drawerOpen) { renderDrawer(); drawerReturn = document.activeElement; }
  showDrawerEls();
  void drawerEl.offsetWidth;                         // parte dalla posizione attuale
  releaseDrawerStyles();
  drawerEl.classList.add('open'); scrimEl.classList.add('open');
  document.body.classList.add('drawer-open');
  $('#btnFilters').setAttribute('aria-expanded', 'true');
  if (!drawerOpen) {
    drawerOpen = true;
    if (!drawerPushed) { try { history.pushState({ drawer: 1 }, ''); drawerPushed = true; } catch (e) {} }   // il gesto Indietro chiude il pannello
    setTimeout(function () { try { $('#drawerX').focus({ preventScroll: true }); } catch (e) {} }, 30);
  }
}
function closeDrawer(fromPop) {
  var was = drawerOpen;
  drawerOpen = false;
  releaseDrawerStyles();
  drawerEl.classList.remove('open'); scrimEl.classList.remove('open');
  document.body.classList.remove('drawer-open');
  $('#btnFilters').setAttribute('aria-expanded', 'false');
  clearTimeout(drawerTimer);
  drawerTimer = setTimeout(function () { if (!drawerOpen) { drawerEl.hidden = true; scrimEl.hidden = true; drawerEl.setAttribute('inert', ''); } }, 280);
  if (drawerPushed && !fromPop) { drawerPushed = false; try { history.back(); } catch (e) {} }
  if (was && drawerReturn && drawerReturn.focus && drawerEl.contains(document.activeElement)) { try { drawerReturn.focus({ preventScroll: true }); } catch (e) {} }
}
$('#btnFilters').addEventListener('click', function () { drawerOpen ? closeDrawer() : openDrawer('flt'); });
$('#edgeTab').addEventListener('click', function () { openDrawer('flt'); });
$('#btnOpts').addEventListener('click', function () { openDrawer('opt'); });
$('#dtFlt').addEventListener('click', function () { setDrawerTab('flt'); renderDrawer(); });
$('#dtOpt').addEventListener('click', function () { setDrawerTab('opt'); });
$('#drawerOpts').addEventListener('click', function (e) {
  var x = e.target.closest('[data-sec]');
  if (!x) return;
  if (x.dataset.sec === 'export') { closeDrawer(); openExport(); return; }
  var had = drawerPushed; drawerPushed = false;
  closeDrawer(true);
  openOptions(x.dataset.sec, had);
});

/* ---------- Aspetto: tema automatico / chiaro / scuro, colori e caratteri ---------- */
var darkMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function applyLook(rerender) {
  var root = document.documentElement;
  root.setAttribute('data-look', settings.look);
  if (settings.theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', settings.theme);
  root.setAttribute('data-pal', settings.pal); root.setAttribute('data-ft', settings.ft); root.setAttribute('data-fb', settings.fb);
  var dark = settings.theme === 'dark' || (settings.theme === 'auto' && darkMQ && darkMQ.matches);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m && !root.hasAttribute('data-splash')) m.setAttribute('content', PALS[settings.pal][dark ? 1 : 0]);   // durante l'apertura la barra resta verde
  ['theme', 'pal', 'ft', 'fb'].forEach(function (k) {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="' + k + '"]'), function (r) { r.checked = r.value === settings[k]; });
  });
  $('#icoLoan').innerHTML = icon('loan');
  if (rerender) { renderList(); updateSummary(); }
}
if (darkMQ) { var onDark = function () { if (settings.theme === 'auto') applyLook(false); }; if (darkMQ.addEventListener) darkMQ.addEventListener('change', onDark); else if (darkMQ.addListener) darkMQ.addListener(onDark); }
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.name === 'theme') { settings.theme = t.value === 'light' || t.value === 'dark' ? t.value : 'auto'; saveSettings(); applyLook(true); }
  else if (t.name === 'pal' && PALS[t.value]) { settings.pal = t.value; saveSettings(); applyLook(false); }
  else if (t.name === 'ft' && FONTS_T.indexOf(t.value) >= 0) { settings.ft = t.value; saveSettings(); applyLook(false); }
  else if (t.name === 'fb' && FONTS_B.indexOf(t.value) >= 0) { settings.fb = t.value; saveSettings(); applyLook(false); }
});
$('#lookReset').addEventListener('click', function () {
  var before = { theme: settings.theme, pal: settings.pal, ft: settings.ft, fb: settings.fb };
  settings.theme = 'light'; settings.pal = 'bosco'; settings.ft = 'literata'; settings.fb = 'plex'; saveSettings(); applyLook(true);
  toast('Aspetto predefinito: tema chiaro, verde, Literata.', { label: 'Annulla', fn: function () { Object.assign(settings, before); saveSettings(); applyLook(true); } });
});

/* ---------- versione: quale stai usando e se ce n'e' una piu' nuova ---------- */
var latestVer = null, verChecking = null;
function itLongDate(d) { try { return new Date(d + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d; } }
function renderVersion() {
  $('#verNum').textContent = 'Versione ' + APP_VERSION.v;
  $('#verDate').textContent = 'del ' + itLongDate(APP_VERSION.date);
  $('#verNote').textContent = 'Ultime novità: ' + APP_VERSION.note;
  var st = $('#verState'), up = $('#verUpdate');
  if (latestVer && latestVer.v > APP_VERSION.v) {
    st.textContent = 'È disponibile la versione ' + latestVer.v + ' del ' + itLongDate(latestVer.date) + '.';
    st.className = 'ver-state new'; up.hidden = false;
  } else if (latestVer) { st.textContent = '✓ È l\'ultima versione.'; st.className = 'ver-state ok'; up.hidden = true; }
  else if (navigator.onLine === false) { st.textContent = 'Senza rete: non posso controllare se ce n\'è una più nuova.'; st.className = 'ver-state'; up.hidden = true; }
  else { st.textContent = 'Controllo se ce n\'è una più nuova…'; st.className = 'ver-state'; up.hidden = true; }
  $('#verApp').textContent = 'Versione ' + APP_VERSION.v + ' del ' + itLongDate(APP_VERSION.date) + (latestVer && latestVer.v > APP_VERSION.v ? ' (c\'è la ' + latestVer.v + ': aggiorna dal menu)' : '') + '.';
}
function checkVersion() {
  if (navigator.onLine === false) { renderVersion(); return Promise.resolve(null); }
  if (verChecking) return verChecking;
  verChecking = fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (j && j.v) latestVer = { v: +j.v, date: String(j.date || ''), note: String(j.note || '') };
    return latestVer;
  }).catch(function () { return null; }).then(function (x) { verChecking = null; renderVersion(); return x; });
  return verChecking;
}
/* Aggiorna: chiede di nuovo i file al sito saltando la memoria del telefono, poi ricarica */
async function updateNow() {
  var b = $('#verUpdate');
  b.disabled = true; b.textContent = 'Aggiorno…';
  try {
    var reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) await reg.update().catch(function () {});
    await Promise.all(['./', 'index.html', 'app.js', 'lib.js', 'style.css', 'sw.js', 'manifest.json'].map(function (u) { return fetch(u, { cache: 'reload' }).catch(function () {}); }));
  } catch (e) {}
  location.reload();
}
$('#verUpdate').addEventListener('click', updateNow);

/* Pagina delle opzioni: una sezione alla volta, con «‹» per tornare al menu e il tasto Indietro del telefono per chiudere */
var optOpen = false, optPushed = false;
function openOptions(sec, reuse) {
  var found = false;
  Array.prototype.forEach.call(document.querySelectorAll('#optSheet .opt-sec'), function (s) {
    var on = s.dataset.sec === sec; s.hidden = !on;
    if (on) { found = true; $('#optH').textContent = s.dataset.title; }
  });
  if (!found) return;
  $('#optSheet').hidden = false; optOpen = true;
  $('#optSheet .sheet-in').scrollTop = 0;
  if (reuse) { try { history.replaceState({ opt: 1 }, ''); optPushed = true; } catch (e) {} }
  else if (!optPushed) { try { history.pushState({ opt: 1 }, ''); optPushed = true; } catch (e) {} }
  if (sec === 'search') renderSvc();
  if (sec === 'share') renderSvcShare();
  if (sec === 'app') { renderVersion(); checkVersion(); updateInstallUi(); }
}
function closeOptions(fromPop) {
  if (!optOpen) return;
  $('#optSheet').hidden = true; optOpen = false;
  if (optPushed && !fromPop) { optPushed = false; try { history.back(); } catch (e) {} }
  else optPushed = false;
}
$('#optClose').addEventListener('click', function () { closeOptions(); });
$('#optBack').addEventListener('click', function () {
  var had = optPushed; optPushed = false;
  $('#optSheet').hidden = true; optOpen = false;
  openDrawer('opt', had);
});
window.addEventListener('popstate', function () { if (optOpen) { optPushed = false; closeOptions(true); } });
$('#drawerX').addEventListener('click', function () { closeDrawer(); });
$('#drawerShow').addEventListener('click', function () { closeDrawer(); window.scrollTo({ top: 0 }); });
$('#drawerReset').addEventListener('click', clearFilters);
$('#drawerQX').addEventListener('click', function () { q = ''; $('#q').value = ''; renderList(); updateSummary(); renderDrawer(); });
scrimEl.addEventListener('click', function () { closeDrawer(); });
window.addEventListener('popstate', function () { if (drawerOpen) { drawerPushed = false; closeDrawer(true); } });

/* Il gesto: dal bordo sinistro (o da un punto qualsiasi della meta' sinistra, perche' con la navigazione a gesti
   di Android il bordo e' riservato a Indietro) si trascina verso destra; il pannello segue il pollice.
   Per chiudere: trascina verso sinistra, tocca fuori o usa Indietro. */
var swipe = null;
function swipeBlocked(target) {
  if (scanning || !$('#lightbox').hidden || document.querySelector('.sheet:not([hidden])')) return true;
  return !!(target.closest && target.closest('input, textarea, select, [contenteditable="true"], .chips, .cand, video, .lightbox'));
}
document.addEventListener('touchstart', function (e) {
  swipe = null;
  if (e.touches.length !== 1) return;
  var t = e.touches[0];
  if (drawerOpen) {
    if (e.target.closest('#drawer, #drawerScrim') && !e.target.closest('select')) swipe = { mode: 'close', x0: t.clientX, y0: t.clientY, dir: 0, px: drawerWidth() };
    return;
  }
  if (t.clientX > window.innerWidth * 0.5 || swipeBlocked(e.target)) return;
  swipe = { mode: 'open', x0: t.clientX, y0: t.clientY, dir: 0, px: 0 };
}, { passive: true });
document.addEventListener('touchmove', function (e) {
  if (!swipe || e.touches.length !== 1) return;
  var t = e.touches[0], now = Date.now();
  var dx = swipe.mode === 'open' ? t.clientX - swipe.x0 : swipe.x0 - t.clientX, dy = t.clientY - swipe.y0;
  if (!swipe.dir) {
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    if (dx > 0 && dx > Math.abs(dy) * 1.5) {
      swipe.dir = 1; swipe.base = dx; swipe.lt = now; swipe.lx = dx; swipe.v = 0;
      if (swipe.mode === 'open') { renderDrawer(); drawerReturn = document.activeElement; showDrawerEls(); }
    } else { swipe = null; return; }
  }
  var d = dx - swipe.base, w = drawerWidth();
  if (now > swipe.lt) { swipe.v = (dx - swipe.lx) / (now - swipe.lt); swipe.lt = now; swipe.lx = dx; }
  swipe.px = swipe.mode === 'open' ? Math.min(w, d) : Math.max(0, w - d);
  dragDrawer(swipe.px);
}, { passive: true });
function endSwipe(cancel) {
  var s = swipe; swipe = null;
  if (!s || !s.dir) return;
  var w = drawerWidth();
  if (s.mode === 'open') {
    if (!cancel && (s.px > w * 0.3 || s.v > 0.35)) {
      openDrawer();
      if (!settings.swiped) { settings.swiped = true; saveSettings(); $('#drawerHint').hidden = true; }
    } else { releaseDrawerStyles(); closeDrawer(true); }
  } else {
    if (!cancel && (s.px < w * 0.7 || s.v > 0.35)) closeDrawer();
    else openDrawer();
  }
}
document.addEventListener('touchend', function () { endSwipe(false); }, { passive: true });
document.addEventListener('touchcancel', function () { endSwipe(true); }, { passive: true });

/* ---------- suggerimenti per scaffale, genere e «a chi» (al posto dell'elenco a tendina del browser) ---------- */
var sugg = { el: null, input: null, k: '', idx: -1 };
function suggKey(input) {
  if (input.id === 'loanWho') return loanKind === 's' ? '' : 'p';
  var k = input.dataset && input.dataset.k;
  return (k === 'sh' || k === 'gen') && input.closest('#list') && !input.closest('[data-ex]') ? k : '';
}
function suggValues(k, input) {
  var m = {};
  state.books.forEach(function (b) {
    var vals = k === 'p' ? [b.p, b.xa] : [b[k]];
    vals.forEach(function (v) { v = String(v || '').trim(); if (!v) return; var key = L.norm(v); (m[key] || (m[key] = { v: v, n: 0 })).n++; });
  });
  return Object.keys(m).map(function (key) { return m[key]; }).sort(function (x, y) { return y.n - x.n || coll.compare(x.v, y.v); });
}
function hideSugg() {
  if (sugg.el) sugg.el.remove();
  if (sugg.input) sugg.input.setAttribute('aria-expanded', 'false');
  sugg = { el: null, input: null, k: '', idx: -1 };
}
function showSugg(input) {
  var k = suggKey(input);
  if (!k) { hideSugg(); return; }
  var cur = L.norm(input.value.trim());
  var list = suggValues(k, input).filter(function (x) { var n = L.norm(x.v); return n !== cur && (!cur || n.indexOf(cur) >= 0); }).slice(0, 8);
  if (sugg.input !== input) hideSugg();
  if (!list.length) { if (sugg.el) sugg.el.remove(); sugg.el = null; input.setAttribute('aria-expanded', 'false'); return; }
  var box = sugg.el || document.createElement('div');
  box.className = 'sugg'; box.id = 'suggBox'; box.setAttribute('role', 'listbox');
  box.innerHTML = list.map(function (x) { return '<button type="button" role="option" tabindex="-1" data-v="' + esc(x.v) + '">' + esc(x.v) + '<span class="n">' + x.n + '</span></button>'; }).join('');
  if (!sugg.el) {
    (input.closest('.f, .field') || input.parentNode).appendChild(box);
    box.addEventListener('pointerdown', function (e) { e.preventDefault(); });        // il campo resta attivo
    box.addEventListener('mousedown', function (e) { e.preventDefault(); });
    box.addEventListener('click', function (e) { var o = e.target.closest('[data-v]'); if (o) { e.preventDefault(); pickSugg(o.dataset.v); } });
  }
  input.setAttribute('aria-expanded', 'true'); input.setAttribute('aria-controls', 'suggBox'); input.setAttribute('aria-autocomplete', 'list');
  sugg = { el: box, input: input, k: k, idx: -1 };
}
function pickSugg(v) {
  var input = sugg.input;
  hideSugg();
  if (!input) return;
  input.value = v;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
document.addEventListener('focusin', function (e) { var t = e.target; if (t && t.tagName === 'INPUT' && suggKey(t)) showSugg(t); });
document.addEventListener('input', function (e) { var t = e.target; if (t && t.tagName === 'INPUT' && suggKey(t)) showSugg(t); });
document.addEventListener('focusout', function (e) { if (sugg.input && e.target === sugg.input) setTimeout(function () { if (sugg.input && document.activeElement !== sugg.input) hideSugg(); }, 120); });
document.addEventListener('keydown', function (e) {
  if (!sugg.el || e.target !== sugg.input) return;
  var opts = sugg.el.querySelectorAll('[data-v]');
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    sugg.idx = (sugg.idx + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
    Array.prototype.forEach.call(opts, function (o, i) { o.setAttribute('aria-selected', i === sugg.idx ? 'true' : 'false'); });
  } else if (e.key === 'Enter' && sugg.idx >= 0) { e.preventDefault(); e.stopPropagation(); pickSugg(opts[sugg.idx].dataset.v); }
  else if (e.key === 'Escape') { e.stopPropagation(); hideSugg(); }
}, true);

/* ---------- copie dello stesso libro ---------- */
/* Un'altra copia: stessi dati del libro, ma scaffale, note, prestito e lettura propri. Entrambe vengono segnate come copie. */
function addCopy(id, quiet) {
  var src = get(id);
  if (!src) return null;
  var wasCp = src.cp;
  var copy = cleanBook(Object.assign({}, src, { id: newId(), ts: Date.now(), cp: true, sh: '', n: '', p: '', pd: '', rs: 'da', rt: 0, rd: '', xs: '', xd: '', xa: '', g: src.g.slice() }));
  src.cp = true;
  state.books.push(copy);
  if (coverURL[id]) fetch(coverURL[id]).then(function (r) { return r.blob(); }).then(function (bl) { return saveCover(copy.id, bl); }).catch(function () {});
  touch();
  if (!quiet && !scanning) {
    openState[copy.id] = true;
    renderList(); updateSummary();
    toast('Aggiunta un\'altra copia di «' + (src.t || src.i) + '».', { label: 'Annulla', fn: function () {
      state.books = state.books.filter(function (b) { return b.id !== copy.id; });
      var x = get(id); if (x) x.cp = wasCp;
      renderList(); touch(); updateSummary();
    } });
  }
  return copy;
}
var dupId = null;
function dupGroupOf(id) {
  return L.dupGroups(state.books).find(function (g) { return g.some(function (x) { return x.id === id; }); }) || [get(id)].filter(Boolean);
}
function openDup(id) {
  var b = get(id);
  if (!b) return;
  dupId = id;
  var g = dupGroupOf(id), cps = g.filter(function (x) { return x.cp; }), title = b.t || b.i, where = b.w ? 'nei Desideri' : 'in Libreria';
  var allCopies = cps.length === g.length && g.length > 1;
  $('#dupH').textContent = allCopies ? 'Hai ' + g.length + ' copie' : 'Stesso libro più volte';
  $('#dupMsg').textContent = allCopies
    ? '«' + title + '» è segnato come ' + g.length + ' copie ' + where + '. Ognuna può avere il suo scaffale, le sue note e il suo prestito.'
    : '«' + title + '» compare ' + g.length + ' volte ' + where + (cps.length ? ' (' + cps.length + ' già segnate come copie).' : '.') + ' Sono copie diverse che possiedi, o lo stesso libro inserito due volte?';
  $('#dupCopies').hidden = allCopies; $('#dupMerge').hidden = allCopies; $('#dupUnmark').hidden = !allCopies;
  $('#dupSheet').hidden = false;
}
function closeDup() { $('#dupSheet').hidden = true; dupId = null; }
function dupCopies() {
  var g = dupGroupOf(dupId), before = g.map(function (x) { return [x.id, x.cp]; });
  g.forEach(function (x) { x.cp = true; });
  closeDup(); renderList(); touch(); updateSummary();
  toast('Segnate come ' + g.length + ' copie.', { label: 'Annulla', fn: function () { before.forEach(function (p) { var x = get(p[0]); if (x) x.cp = p[1]; }); renderList(); touch(); updateSummary(); } });
}
function dupUnmark() {
  var g = dupGroupOf(dupId);
  g.forEach(function (x) { x.cp = false; });
  closeDup(); renderList(); touch(); updateSummary();
  toast('Non più copie: ora sono segnalati come doppione.');
}
function dupMerge() {
  var g = dupGroupOf(dupId), cps = g.filter(function (x) { return x.cp; }), plain = g.filter(function (x) { return !x.cp; });
  // con copie segnate: la registrazione in piu' confluisce nella prima copia, le altre copie restano
  var grp = cps.length ? [cps[0]].concat(plain) : g;
  if (grp.length < 2) { closeDup(); return; }
  var snapshot = JSON.stringify(state.books);
  var m = L.mergeBooks(grp), keep = cleanBook(m.keep);
  var i = state.books.findIndex(function (b) { return b.id === keep.id; });
  if (i >= 0) state.books[i] = keep;
  m.removed.forEach(function (rid) { if (!coverURL[keep.id] && coverURL[rid]) fetch(coverURL[rid]).then(function (r) { return r.blob(); }).then(function (bl) { return saveCover(keep.id, bl); }).catch(function () {}); });
  state.books = state.books.filter(function (b) { return m.removed.indexOf(b.id) < 0; });
  closeDup(); renderList(); touch(); updateSummary();
  toast('Unito in un solo libro.', { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot).map(cleanBook).filter(Boolean); renderList(); touch(); updateSummary(); } });
}

/* ---------- condividi la lista dei Desideri ---------- */
function wishText() {
  var books = state.books.filter(function (b) { return b.w && hasData(b); }).sort(cmpFor('titolo'));
  var total = books.reduce(function (s, b) { return s + (b.c || 0); }, 0);
  var lines = books.map(function (b) {
    var ed = [b.e, b.y].filter(Boolean).join(', ');
    return '• ' + (b.t || 'ISBN ' + b.i) + (b.a ? ' — ' + b.a : '') + (ed ? ' (' + ed + ')' : '') + (b.c != null ? ' · ' + eur(b.c) : '') + (L.toIsbn13(b.i) ? '\n   ISBN ' + L.toIsbn13(b.i) : '');
  });
  return { n: books.length, text: 'Libri che vorrei (' + books.length + '):\n\n' + lines.join('\n') + (total ? '\n\nTotale: ' + eur(total) : '') };
}
/* ---------- condividere un libro o una lista, e aprire quelli ricevuti ----------
   Il pacchetto (L.buildShare) viaggia nel link dell'app dopo «#l=»: compresso quando il browser lo permette («z…»), altrimenti
   in chiaro («j…»). Le liste troppo lunghe per un link partono come file, che si apre da Esporta › Ripristina. */
var SHARE_URL_MAX = 3600;
function b64url(bytes) { var bin = ''; for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64url(t) { var bin = atob(t.replace(/-/g, '+').replace(/_/g, '/')), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
async function pipeBytes(bytes, stream) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer()); }
async function encodeShare(o) {
  var raw = new TextEncoder().encode(JSON.stringify(o));
  if (window.CompressionStream) { try { return 'z' + b64url(await pipeBytes(raw, new CompressionStream('deflate-raw'))); } catch (e) {} }
  return 'j' + b64url(raw);
}
async function decodeShare(t) {
  var sh = L.parseShare(await decodeRaw(t));
  if (!sh) throw new Error('formato');
  return sh;
}
async function decodeRaw(t) {
  t = String(t || '');
  if (!/^[zj][\w-]+$/.test(t) || t.length > 60000) throw new Error('formato');
  var bytes = unb64url(t.slice(1));
  if (t[0] === 'z') {
    if (!window.DecompressionStream) throw new Error('vecchio');
    bytes = await pipeBytes(bytes, new DecompressionStream('deflate-raw'));
    if (bytes.length > 400000) throw new Error('formato');
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
/* i libri che vedi ora, adatti a essere mandati */
function shareable() { return visible().filter(function (b) { return hasData(b) && (b.t || L.toIsbn13(b.i)); }); }
function toggleFav(id) {
  var b = get(id);
  if (!b) return;
  b.fav = !b.fav; touch(); refreshRow(id);
  if (flt === 'fav' && !b.fav) { renderList(); updateSummary(); }
  toast(b.fav ? 'Tra i preferiti. Li trovi in Filtri › Preferiti: da lì puoi anche condividerli.' : 'Tolto dai preferiti.');
}
var shareCtx = null;
/* books: cosa mando; ctx.kind: book / fav / wish / list; ctx.title: nome proposto per la lista */
function openShare(books, ctx) {
  books = (books || []).filter(function (b) { return b.t || L.toIsbn13(b.i); });
  if (!books.length) { toast('Non c\'è niente da condividere.'); return; }
  var cut = books.length > L.SHARE_MAX;
  shareCtx = { books: books.slice(0, L.SHARE_MAX), kind: ctx.kind };
  var one = ctx.kind === 'book', n = shareCtx.books.length;
  $('#shareH').textContent = one ? 'Condividi il libro' : 'Condividi la lista';
  $('#shareWhat').textContent = one ? '«' + (books[0].t || 'ISBN ' + books[0].i) + '»' + (books[0].a ? ' di ' + books[0].a : '')
    : (ctx.kind === 'fav' ? 'I tuoi preferiti: ' : ctx.kind === 'wish' ? 'I tuoi desideri: ' : '') + n + (n === 1 ? ' libro' : ' libri') + (cut ? ' (i primi ' + L.SHARE_MAX + ' su ' + books.length + ')' : '') + '.';
  $('#shareTitleBox').hidden = ctx.kind !== 'list';
  $('#shareTitle').value = ctx.kind === 'list' ? (ctx.title || '') : '';
  $('#shareName').value = settings.name || '';
  $('#exportSheet').hidden = true; $('#toast').hidden = true;
  $('#shareSheet').hidden = false;
  sharePreview();
}
function sharePack() {
  var name = $('#shareName').value.replace(/\s+/g, ' ').trim().slice(0, 30);
  return L.buildShare(shareCtx.books, { kind: shareCtx.kind, name: name, title: $('#shareTitle').value });
}
function sharePreview() { if (shareCtx) $('#sharePrev').textContent = 'Chi riceve vedrà: ' + L.shareHeading(L.parseShare(sharePack())); }
function closeShare() { $('#shareSheet').hidden = true; shareCtx = null; }
function saveName(v) {
  v = String(v || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  if (v === (settings.name || '')) return;
  settings.name = v; saveSettings();
  $('#optName').value = v;
  renderOwner();
}
/* in testata, sotto «Next Libris»: «Libreria di Piero»; senza nome, l'invito a scriverlo */
function renderOwner() {
  var el = $('#owner');
  el.innerHTML = settings.name ? 'Libreria di <b>' + esc(settings.name) + '</b>'
    : '<button type="button" class="link" id="ownerSet">Scrivi il tuo nome</button>';
}
$('#owner').addEventListener('click', function (e) { if (e.target.closest('#ownerSet')) { openOptions('share'); setTimeout(function () { try { $('#optName').focus(); } catch (x) {} }, 80); } });
async function sendShare(copyOnly) {
  if (!shareCtx) return;
  var pack = sharePack(), sh = L.parseShare(pack);
  if (pack.n) saveName(pack.n);
  var head = L.shareHeading(sh), text = L.shareText(sh), code = await encodeShare(pack);
  var url = APP_URL + '#l=' + code, one = sh.books.length === 1;
  var invite = one ? 'Aprilo in Next Libris per aggiungerlo ai tuoi libri:' : 'Aprila in Next Libris per aggiungerli ai tuoi:';
  closeShare();
  if (url.length > SHARE_URL_MAX) return shareListFile(pack, sh, head);
  if (!copyOnly && navigator.share) {
    try { await navigator.share({ title: head, text: text + '\n\n' + invite, url: url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  var all = text + '\n\n' + invite + '\n' + url;
  if (await copyText(all)) toast('Copiato: incollalo in WhatsApp, in un messaggio o in una mail.');
  else { $('#copyBox').value = all; $('#copySheet').hidden = false; $('#copyBox').focus(); $('#copyBox').select(); }
}
/* lista troppo lunga per un link: parte come file (.json, o .txt se il telefono non condivide i .json) */
async function shareListFile(pack, sh, head) {
  var data = JSON.stringify({ app: 'next-libris', share: pack });
  var base = 'next-libris-lista' + (sh.name ? '-' + L.norm(sh.name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '');
  var how = 'Per aggiungerli: salva il file allegato, poi in Next Libris apri Esporta › «Ripristina da backup o apri una lista ricevuta».';
  var cands = [new File([data], base + '.json', { type: 'application/json' }), new File([data], base + '.txt', { type: 'text/plain' })], file = null;
  for (var i = 0; i < cands.length && !file; i++) if (navigator.canShare && navigator.canShare({ files: [cands[i]] })) file = cands[i];
  if (file && navigator.share) {
    try { await navigator.share({ files: [file], title: head, text: L.shareText(sh, 10) + '\n\n' + how }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  downloadBlob(base + '.json', data, 'application/json');
  toast('La lista è lunga: l\'ho scaricata come file. Mandalo come allegato; chi lo riceve lo apre da Esporta › Ripristina.');
}
function shareList() {
  var books = shareable().filter(function (b) { return !b.xs; });
  var onlyFlt = !q && activeCount() === (flt ? 1 : 0);
  var kind = tab === 'wish' && !q && !activeCount() ? 'wish' : (flt === 'fav' && onlyFlt ? 'fav' : 'list');
  var title = genFlt && genFlt !== NONE ? facetName('gen', genFlt) : autFlt ? autName : shFlt && shFlt !== NONE ? facetName('sh', shFlt) : edFlt ? facetName('e', edFlt) : q ? q : '';
  openShare(books, { kind: kind, title: String(title || '').slice(0, 40) });
}
$('#shareForm').addEventListener('submit', function (e) { e.preventDefault(); sendShare(false); });
$('#shareCopy').addEventListener('click', function () { sendShare(true); });
$('#shareClose').addEventListener('click', closeShare);
$('#shareSheet').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeShare(); });
$('#shareName').addEventListener('input', sharePreview);
$('#shareTitle').addEventListener('input', sharePreview);
$('#btnShareList2').addEventListener('click', shareList);
$('#optName').addEventListener('change', function (e) { saveName(e.target.value); e.target.value = settings.name; toast(settings.name ? 'Nome salvato: ' + settings.name + '.' : 'Nome tolto.'); });
document.addEventListener('change', function (e) { if (e.target.id === 'welcomeName') { saveName(e.target.value); e.target.value = settings.name; } });

/* --- libri ricevuti: anteprima, scelta, e dove metterli --- */
var incoming = null;
function ownedLike(x) {
  var k = L.norm(x.t) + '|' + L.norm(x.a);
  return state.books.find(function (b) {
    var bi = L.toIsbn13(b.i);
    if (x.i && bi) return bi === x.i;                      // due ISBN: decide l'ISBN (edizioni diverse = libri diversi)
    return !!x.t && L.norm(b.t) + '|' + L.norm(b.a) === k;
  }) || null;
}
function openImport(sh) {
  incoming = sh;
  var n = sh.books.length, have = 0;
  $('#importH').textContent = L.shareHeading(sh);
  $('#importList').innerHTML = sh.books.map(function (x, i) {
    var o = ownedLike(x), where = o ? (o.w ? 'Già nei Desideri' : 'Ce l\'hai già') : '';
    if (o) have++;
    var ed = [x.e, x.y, x.gen, x.pg ? x.pg + ' pagine' : '', x.c != null ? eur(x.c) : ''].filter(Boolean).join(' · ');
    return '<li><label class="imp-row' + (o ? ' have' : '') + '"><input type="checkbox" data-i="' + i + '"' + (o ? ' disabled' : ' checked') + '>' +
      '<span class="imp-c">' + (x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</span>' +
      '<span class="imp-t"><b>' + esc(x.t || 'ISBN ' + x.i) + '</b>' + (x.a ? '<span>' + esc(x.a) + '</span>' : '') + (ed ? '<small>' + esc(ed) + '</small>' : '') + '</span>' +
      (where ? '<span class="tag">' + where + '</span>' : '') + '</label></li>';
  }).join('');
  $('#importList').classList.toggle('single', n === 1);
  $('#importMsg').textContent = (n === 1 ? '' : n + ' libri. ') + (have === n ? (n === 1 ? 'Questo libro è già nel tuo elenco.' : 'Sono già tutti nel tuo elenco.')
    : (n === 1 ? 'Dove lo metto?' : 'Togli la spunta a quelli che non ti interessano, poi scegli dove metterli.') + (have ? ' ' + have + (have === 1 ? ' ce l\'hai già.' : ' li hai già.') : ''));
  $('#importHint').textContent = 'Desideri: libri da comprare o da leggere. Libreria: libri che hai già in casa.' + (sh.name ? ' Resteranno segnati «Da ' + sh.name + '».' : '');
  $('#importWish').hidden = $('#importLib').hidden = have === n;
  $('#importClose').textContent = have === n ? 'Chiudi' : 'Non ora';
  $('#importSheet').hidden = false;
}
function closeImport() { $('#importSheet').hidden = true; incoming = null; }
function doImport(wish) {
  var sh = incoming;
  if (!sh) return;
  var picked = Array.prototype.map.call($('#importList').querySelectorAll('input:checked:not(:disabled)'), function (c) { return sh.books[+c.dataset.i]; }).filter(Boolean);
  if (!picked.length) { toast('Metti la spunta ad almeno un libro.'); return; }
  var from = sh.name || 'un amico', label = L.shareLabel(sh), ids = [], now = Date.now();
  picked.forEach(function (x, k) {
    var b = blankBook({ t: x.t, a: x.a, e: x.e, y: x.y, i: x.i, c: x.c, img: x.img, imgL: x.imgL, gen: x.gen, pg: x.pg, w: wish, fr: from, fl: label, ts: now + k, ck: today() });
    state.books.push(b); ids.push(b.id);
  });
  closeImport();
  q = ''; $('#q').value = ''; setView('list'); setTab(wish ? 'wish' : 'lib');
  frFlt = from; renderList(); updateSummary(); touch();
  toast(ids.length + (ids.length === 1 ? ' libro aggiunto' : ' libri aggiunti') + (wish ? ' ai Desideri.' : ' alla Libreria.'), { label: 'Annulla', fn: function () {
    state.books = state.books.filter(function (b) { return ids.indexOf(b.id) < 0; }); frFlt = ''; renderList(); updateSummary(); touch(); } });
  // le copertine: le cerco con calma, solo della stessa edizione
  if (navigator.onLine !== false) ids.slice(0, 40).forEach(function (id) {
    coverPool(async function () {
      var b = get(id);
      if (!b || smallImg(b) || !L.toIsbn13(b.i)) return;
      try { var r = await findCover(b, 6000, true); b = get(id); if (r && !r.alt && b && !smallImg(b)) { b.img = r.url; if (r.big) b.imgL = r.url; touch(); syncThumbs(); refreshRow(id); } } catch (e) {}
    });
  });
}
$('#importWish').addEventListener('click', function () { doImport(true); });
$('#importLib').addEventListener('click', function () { doImport(false); });
$('#importClose').addEventListener('click', closeImport);
/* link ricevuto: l'app si apre con «#l=...» nell'indirizzo */
var hashBusy = false;
async function checkIncoming() {
  var m = /^#([lk])=([\w-]+)$/.exec(location.hash || '');
  if (!m || hashBusy) return;
  hashBusy = true;
  try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
  try {
    if (m[1] === 'k') { var o = await decodeRaw(m[2]); if (!o || o.v !== 1 || o.t !== 'svc') throw new Error('formato'); openSvcImport(o); }
    else openImport(await decodeShare(m[2]));
  }
  catch (e) { toast(e && e.message === 'vecchio' ? 'Questo browser è troppo vecchio per aprire il link: aggiorna Chrome e riprova.' : (m[1] === 'k' ? 'Il link non contiene una chiave o un worker validi' : 'Il link non contiene una lista valida') + ': forse è stato tagliato. Fattelo rimandare.'); }
  hashBusy = false;
}
window.addEventListener('hashchange', checkIncoming);
async function shareWish() { shareList(); }
/* ---------- condividere chiave Google e worker SBN (link «#k=...») ----------
   Chi riceve vede cosa arriva e da chi, e decide; quelli che aveva gia' restano tra i salvati. */
function cleanKey(v) { v = String(v || '').replace(/\s+/g, ''); return /^[A-Za-z0-9_-]{20,80}$/.test(v) ? v : ''; }
function okWorker(v) { v = cleanWorker(v); return /^https:\/\/[^\s/]+\.[^\s]+$/.test(v) && v.length <= 200 ? v : ''; }
function renderSvcShare() {
  var has = !!(settings.sbnUrl || settings.gbKey);
  $('#svcShareBtn').disabled = !has;
  $('#svcShareNone').hidden = has;
}
function openSvcShare() {
  if (!settings.sbnUrl && !settings.gbKey) { toast('Non hai né chiave Google né worker da condividere: impostali in Opzioni › Ricerca dei libri.'); return; }
  $('#svcWhat').textContent = [settings.sbnUrl ? 'Worker SBN: ' + svcShort('sbn', settings.sbnUrl) : '', settings.gbKey ? 'Chiave Google: ' + svcShort('key', settings.gbKey) : ''].filter(Boolean).join(' · ');
  $('#svcSbnOn').checked = !!settings.sbnUrl; $('#svcSbnOn').disabled = !settings.sbnUrl;
  $('#svcKeyOn').checked = !!settings.gbKey; $('#svcKeyOn').disabled = !settings.gbKey;
  $('#svcSendName').value = settings.name || '';
  closeOptions(); $('#toast').hidden = true;
  $('#svcSheet').hidden = false;
}
function closeSvcShare() { $('#svcSheet').hidden = true; }
async function sendSvcShare(copyOnly) {
  var o = { v: 1, t: 'svc' };
  if ($('#svcSbnOn').checked && settings.sbnUrl) o.sb = settings.sbnUrl;
  if ($('#svcKeyOn').checked && settings.gbKey) o.gk = settings.gbKey;
  if (!o.sb && !o.gk) { toast('Scegli almeno uno dei due.'); return; }
  var name = $('#svcSendName').value.replace(/\s+/g, ' ').trim().slice(0, 30);
  if (name) { o.n = name; saveName(name); }
  var what = o.sb && o.gk ? 'la chiave Google e il worker SBN' : o.gk ? 'la chiave Google' : 'il worker SBN';
  var text = (name || 'Ti mando') + (name ? ' ti manda ' : ' ') + what + ' per Next Libris: con questi la ricerca dei libri è più completa. Aprilo in Next Libris (non inoltrarlo ad altri):';
  var url = APP_URL + '#k=' + await encodeShare(o);
  closeSvcShare();
  if (!copyOnly && navigator.share) {
    try { await navigator.share({ title: 'Impostazioni di ricerca per Next Libris', text: text, url: url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  var all = text + '\n' + url;
  if (await copyText(all)) toast('Copiato: incollalo in un messaggio privato.');
  else { $('#copyBox').value = all; $('#copySheet').hidden = false; $('#copyBox').focus(); $('#copyBox').select(); }
}
var svcIn = null;
function openSvcImport(o) {
  var sb = okWorker(o.sb), gk = cleanKey(o.gk), from = String(o.n || '').replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, 30);
  if (!sb && !gk) throw new Error('formato');
  svcIn = { sb: sb, gk: gk };
  $('#svcInH').textContent = (from ? from + ' ti manda ' : 'Ti arrivano ') + (sb && gk ? 'chiave Google e worker SBN' : gk ? 'la chiave Google' : 'il worker SBN');
  var rows = [];
  if (sb) rows.push('Worker SBN: ' + svcShort('sbn', sb) + (settings.sbnUrl && settings.sbnUrl !== sb ? ' (al posto del tuo, che resta tra i salvati)' : settings.sbnUrl === sb ? ' (lo usi già)' : ''));
  if (gk) rows.push('Chiave Google: ' + svcShort('key', gk) + (settings.gbKey && settings.gbKey !== gk ? ' (al posto della tua, che resta tra le salvate)' : settings.gbKey === gk ? ' (la usi già)' : ''));
  $('#svcInList').innerHTML = rows.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
  $('#svcInSheet').hidden = false;
}
function closeSvcImport() { $('#svcInSheet').hidden = true; svcIn = null; }
$('#svcInUse').addEventListener('click', function () {
  var x = svcIn; if (!x) return;
  var before = { sbn: settings.sbnUrl, key: settings.gbKey };
  if (x.sb) setSvc('sbn', x.sb);
  if (x.gk) setSvc('key', x.gk);
  closeSvcImport();
  toast((x.sb && x.gk ? 'Worker e chiave in uso' : x.gk ? 'Chiave in uso' : 'Worker in uso') + '. Li trovi in Opzioni › Ricerca dei libri.', { label: 'Annulla', fn: function () { setSvc('sbn', before.sbn); setSvc('key', before.key); } });
});
$('#svcInLater').addEventListener('click', function () {
  var x = svcIn; if (!x) return;
  if (x.sb) remember('sbn', x.sb); if (x.gk) remember('key', x.gk);
  renderSvc(); closeSvcImport();
  toast('Messi tra i salvati: li rimetti quando vuoi da Opzioni › Ricerca dei libri.');
});
$('#svcInNo').addEventListener('click', closeSvcImport);
$('#svcShareBtn').addEventListener('click', openSvcShare);
$('#svcForm').addEventListener('submit', function (e) { e.preventDefault(); sendSvcShare(false); });
$('#svcCopy').addEventListener('click', function () { sendSvcShare(true); });
$('#svcClose').addEventListener('click', closeSvcShare);

/* ---------- 7) unisci i doppioni ---------- */
function mergeDups() {
  var all = L.dupGroups(state.books);
  var groups = all.filter(function (g) { return !g.some(function (b) { return b.cp; }); });
  var held = all.length - groups.length;
  if (!groups.length) { toast(held ? 'Non ci sono doppioni da unire: i libri ripetuti sono segnati come copie diverse.' : 'Non ci sono doppioni.'); return; }
  var snapshot = JSON.stringify(state.books), removed = 0;
  groups.forEach(function (g) {
    var m = L.mergeBooks(g), keep = cleanBook(m.keep);
    var i = state.books.findIndex(function (b) { return b.id === keep.id; });
    if (i >= 0) state.books[i] = keep;
    m.removed.forEach(function (rid) {
      if (!coverURL[keep.id] && coverURL[rid]) fetch(coverURL[rid]).then(function (r) { return r.blob(); }).then(function (bl) { return saveCover(keep.id, bl); }).catch(function () {});
    });
    state.books = state.books.filter(function (b) { return m.removed.indexOf(b.id) < 0; });
    removed += m.removed.length;
  });
  renderList(); touch(); updateSummary();
  toast('Uniti ' + removed + (removed === 1 ? ' doppione' : ' doppioni') + ' in ' + groups.length + (groups.length === 1 ? ' libro' : ' libri') + (held ? '; non toccati ' + held + ' con copie segnate.' : '.'), { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot).map(cleanBook).filter(Boolean); renderList(); touch(); updateSummary(); } });
}

/* ---------- 7) promemoria dei prestiti lunghi ---------- */
function checkLoanNag() {
  var DAY = 86400000, now = Date.now();
  if (now - settings.loanSnooze < 7 * DAY || !$('#notice').hidden) return;
  var old = state.books.filter(function (b) { return !b.w && b.p && b.pd && now - Date.parse(b.pd) > 30 * DAY; })
    .sort(function (x, y) { return x.pd < y.pd ? -1 : 1; });
  if (!old.length) return;
  var b = old[0], ago = L.agoText(Date.parse(b.pd)).replace(/ fa$/, '');
  var msg = b.p + ' ha «' + (b.t || b.i) + '» da ' + ago + '.' + (old.length > 1 ? ' Altri ' + (old.length - 1) + (old.length === 2 ? ' libro è' : ' libri sono') + ' in prestito da più di un mese.' : '');
  function later() { settings.loanSnooze = Date.now(); saveSettings(); }
  notice(msg, 'Vedi i prestiti', function () { later(); if (tab !== 'lib') setTab('lib'); flt = 'loan'; renderList(); updateSummary(); window.scrollTo({ top: 0 }); }, later, 'loan');
}

/* ---------- 7) catalogo stampabile / PDF ---------- */
async function printCatalog() {
  var books = visible().filter(hasData);
  if (!books.length) { toast('Non ci sono libri da stampare con la ricerca e i filtri attuali.'); return; }
  var covers = $('#printCovers').checked && books.some(function (b) { return !!smallImg(b); });
  var has = function (k) { return books.some(function (b) { return b[k]; }); };
  var cols = [['t', 'Titolo'], ['a', 'Autore'], ['e', 'Casa editrice'], ['y', 'Anno'], ['c', 'Prezzo']];
  if (has('sh')) cols.push(['sh', 'Scaffale']);
  if (has('rs')) cols.push(['rs', 'Lettura']);
  if (has('p')) cols.push(['p', 'Prestato a']);
  if (has('xs')) cols.push(['xs', 'Non più in libreria']);
  var total = books.reduce(function (s, b) { return s + (b.xs ? 0 : b.c || 0); }, 0);
  var filt = [q ? 'ricerca «' + q + '»' : '', flt === 'loan' ? 'solo libri in prestito' : '', flt === 'gone' ? 'solo venduti, regalati, smarriti' : '', flt === 'guess' ? 'solo da verificare' : '', flt === 'dup' ? 'solo copie e doppioni' : '', readFlt ? 'lettura: ' + READ_TXT[readFlt].toLowerCase() : '', shFlt ? 'scaffale: ' + facetName('sh', shFlt) : '', genFlt ? 'genere: ' + facetName('gen', genFlt) : '', autFlt ? 'autore: ' + autName : '', edFlt ? 'casa editrice: ' + facetName('e', edFlt) : ''].filter(Boolean).join(', ');
  function cell(b, k) {
    if (k === 'c') return b.c == null ? '' : eur(b.c);
    if (k === 'rs') return readLabel(b);
    if (k === 'xs') return esc(goneText(b));
    return esc(b[k] || '');
  }
  $('#printView').innerHTML = '<h1>Next Libris · ' + (tab === 'wish' ? 'Desideri' : 'Libreria') + '</h1>' +
    '<p class="pv-sub">' + esc(L.itDate(today())) + ' · ' + books.length + (books.length === 1 ? ' libro' : ' libri') + (total ? ' · valore di copertina ' + esc(eur(total)) : '') + (filt ? ' · ' + esc(filt) : '') + '</p>' +
    '<table><thead><tr>' + (covers ? '<th></th>' : '') + cols.map(function (c) { return '<th>' + c[1] + '</th>'; }).join('') + '</tr></thead><tbody>' +
    books.map(function (b) {
      var img = covers ? smallImg(b) : '';
      return '<tr>' + (covers ? '<td class="pv-img">' + (img ? '<img src="' + esc(img) + '" alt="" referrerpolicy="no-referrer">' : '') + '</td>' : '') +
        cols.map(function (c) { return '<td class="pv-' + c[0] + '">' + cell(b, c[0]) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
  $('#exportSheet').hidden = true;
  if (covers) {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('#printView img'));
    await Promise.race([Promise.all(imgs.map(function (i) { return i.complete ? 1 : new Promise(function (r) { i.onload = i.onerror = r; }); })), new Promise(function (r) { setTimeout(r, 5000); })]);
  }
  window.print();
}
window.addEventListener('afterprint', function () { $('#printView').innerHTML = ''; });

/* ---------- prestiti ---------- */
var loanId = null;
/* Una sola finestra per dire dov'e' il libro: prestato (a chi, dal giorno), venduto (il giorno, a chi se vuoi),
   regalato (a chi, il giorno) o smarrito (dal giorno). Venduti, regalati e smarriti restano nell'elenco, in grigio,
   ma non contano piu' nel numero dei libri ne' nel valore della libreria. */
var loanKind = 'p';
var KIND_TXT = {
  p: { h: 'Presta il libro', who: 'A chi', date: 'Dal giorno', need: 'Scrivi a chi lo presti.' },
  v: { h: 'Libro venduto', who: 'A chi (facoltativo)', date: 'Venduto il' },
  r: { h: 'Libro regalato', who: 'A chi', date: 'Regalato il', need: 'Scrivi a chi l\'hai regalato.' },
  s: { h: 'Libro smarrito', who: '', date: 'Smarrito dal' }
};
function setLoanKind(k) {
  var b = get(loanId);
  loanKind = KIND_TXT[k] ? k : 'p';
  var t = KIND_TXT[loanKind];
  Array.prototype.forEach.call($('#loanKind').querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x.dataset.k === loanKind ? 'true' : 'false'); });
  $('#loanH').textContent = b && loanKind === 'p' && b.p ? 'In prestito' : t.h;
  $('#loanWhoF').hidden = !t.who;
  $('#loanWhoL').textContent = t.who || 'A chi';
  $('#loanDateL').textContent = t.date;
  $('#loanErr').hidden = true;
  var cur = b && (b.xs || (b.p ? 'p' : ''));
  $('#loanBack').hidden = !b || !cur;
  $('#loanBack').textContent = !b ? '' : b.xs === 's' ? 'Ritrovato' : b.xs ? 'È tornato in libreria' : 'Restituito';
}
function openLoan(id, kind) {
  var b = get(id);
  if (!b) return;
  loanId = id;
  var k = kind || b.xs || 'p';
  $('#loanBook').textContent = b.t || b.i || 'Libro senza titolo';
  $('#loanWho').value = (b.xs ? b.xa : b.p) || '';
  $('#loanDate').value = (b.xs ? b.xd : b.pd) || today();
  setLoanKind(k);
  $('#loanSheet').hidden = false;
  if (!b.p && !b.xs) setTimeout(function () { $('#loanWho').focus(); }, 50);
}
function closeLoan() { $('#loanSheet').hidden = true; loanId = null; }
function saveLoan() {
  var b = get(loanId), who = $('#loanWho').value.replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!b) { closeLoan(); return; }
  var t = KIND_TXT[loanKind];
  if (t.need && !who) { $('#loanErr').textContent = t.need; $('#loanErr').hidden = false; $('#loanWho').focus(); return; }
  var date = /^\d{4}-\d\d-\d\d$/.test($('#loanDate').value) ? $('#loanDate').value : today();
  var id = loanId, old = { p: b.p, pd: b.pd, xs: b.xs, xd: b.xd, xa: b.xa };
  if (loanKind === 'p') { b.p = who; b.pd = date; b.xs = ''; b.xd = ''; b.xa = ''; }
  else { b.xs = loanKind; b.xd = date; b.xa = loanKind === 's' ? '' : who; b.p = ''; b.pd = ''; }
  closeLoan();
  touch();
  if (flt === 'loan' || flt === 'gone') renderList(); else refreshRow(id);
  updateSummary();
  var msg = loanKind === 'p' ? prestatoA(b.p) + '.' : goneText(b) + '.';
  toast(msg, { label: 'Annulla', fn: function () { var x = get(id); if (x) { Object.assign(x, old); renderList(); touch(); updateSummary(); } } });
}
function returnLoan() {
  var b = get(loanId);
  if (!b) { closeLoan(); return; }
  if (b.xs) {
    var gid = loanId, gold = { xs: b.xs, xd: b.xd, xa: b.xa }, was = b.xs;
    b.xs = ''; b.xd = ''; b.xa = '';
    closeLoan();
    if (flt === 'gone') renderList(); else refreshRow(gid);
    touch(); updateSummary();
    toast(was === 's' ? 'Ritrovato: di nuovo in libreria.' : 'Di nuovo in libreria.', { label: 'Annulla', fn: function () { var x = get(gid); if (x) { Object.assign(x, gold); renderList(); touch(); updateSummary(); } } });
    return;
  }
  var id = loanId, old = { p: b.p, pd: b.pd };
  b.p = ''; b.pd = '';
  closeLoan();
  if (flt === 'loan') renderList(); else refreshRow(id);
  touch(); updateSummary();
  toast('Segnato come restituito.', { label: 'Annulla', fn: function () { var x = get(id); if (x) { x.p = old.p; x.pd = old.pd; renderList(); touch(); updateSummary(); } } });
}
/* ---------- desideri ---------- */
function moveToLib(id, quiet) {
  var b = get(id);
  if (!b || !b.w) return;
  var oldTs = b.ts;
  var oldRs = b.rs, oldOpen = openState[id];
  b.w = false; b.ts = Date.now();
  if (!b.rs) b.rs = 'da';
  openState[id] = false;                         // nell'altro elenco arriva chiuso, in vista compatta
  touch();
  if (!scanning) { renderList(); updateSummary(); }
  if (!quiet) toast('Spostato in Libreria: ' + (b.t || b.i), { label: 'Annulla', fn: function () { var x = get(id); if (x) { x.w = true; x.ts = oldTs; x.rs = oldRs; openState[id] = oldOpen; touch(); renderList(); updateSummary(); } } });
}
/* Dalla Libreria ai Desideri: il libro torna «da comprare»; prestito, stato e lettura non hanno piu' senso e si tolgono
   (con «Annulla» torna tutto com'era). */
function moveToWish(id) {
  var b = get(id);
  if (!b || b.w) return;
  var keep = ['w', 'ts', 'p', 'pd', 'xs', 'xd', 'xa', 'rs', 'rt', 'rd', 'cp'], before = {};
  keep.forEach(function (k) { before[k] = b[k]; });
  var oldOpen = openState[id];
  openState[id] = false;                         // nell'altro elenco arriva chiuso, in vista compatta
  b.w = true; b.ts = Date.now();
  b.p = ''; b.pd = ''; b.xs = ''; b.xd = ''; b.xa = ''; b.rs = ''; b.rt = 0; b.rd = ''; b.cp = false;
  touch(); renderList(); updateSummary();
  toast('Spostato nei Desideri: ' + (b.t || b.i), { label: 'Annulla', fn: function () { var x = get(id); if (x) { Object.assign(x, before); openState[id] = oldOpen; touch(); renderList(); updateSummary(); } } });
}
function setTab(t) {
  tab = t === 'wish' ? 'wish' : 'lib';
  flt = ''; shFlt = ''; genFlt = ''; autFlt = ''; autName = ''; edFlt = ''; frFlt = '';
  $('#tipTxt').textContent = tab === 'wish'
    ? 'Sei nei Desideri: Scansiona, Foto e Digita aggiungono qui i libri da comprare. Un amico ti consiglia un libro? Digita e scrivi il titolo.'
    : 'Scansiona il codice a barre: è il modo più preciso. Dopo ogni libro puoi leggere il prezzo (o saltarlo). Digita per scrivere il titolo o l\'ISBN.';
  document.body.classList.toggle('wishtab', tab === 'wish');
  renderList(); updateSummary();
}
function setView(v) {
  settings.view = v === 'grid' ? 'grid' : 'list';
  saveSettings();
  var b = $('#btnView');
  b.innerHTML = settings.view === 'grid' ? icon('list') + 'Elenco' : icon('grid') + 'Copertine';
  b.setAttribute('aria-label', settings.view === 'grid' ? 'Mostra come elenco' : 'Mostra le copertine');
}
function openFromGrid(id) {
  openState[id] = true;
  setView('list');
  renderList();
  var el = rowEl(id);
  if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1600); }
}
/* ---------- statistiche ---------- */
function barsHTML(title, items, filterable) {
  if (!items.length) return '';
  var max = items.reduce(function (m, x) { return Math.max(m, x.n); }, 1);
  return '<section class="st-sec"><h3>' + esc(title) + '</h3><div class="bars">' + items.map(function (x) {
    var inner = '<span class="bl">' + esc(x.k) + '</span><span class="bt"><span class="bf" style="width:' + Math.max(2, Math.round(x.n / max * 100)) + '%"></span></span><span class="bv">' + x.n + '</span>';
    return filterable ? '<button class="bar-row" data-q="' + esc(x.k) + '" title="Mostra questi libri">' + inner + '</button>' : '<div class="bar-row">' + inner + '</div>';
  }).join('') + '</div></section>';
}
function openStats() {
  var books = tabBooks().filter(hasData);
  if (!books.length) { toast('Aggiungi qualche libro per vedere le statistiche.'); return; }
  var st = L.computeStats(books);
  if (!st.n && !st.gone) { toast('Aggiungi qualche libro per vedere le statistiche.'); return; }
  function tile(v, l, note) { return '<div class="tile"><b>' + esc(v) + '</b><span>' + esc(l) + '</span>' + (note ? '<small>' + esc(note) + '</small>' : '') + '</div>'; }
  var nf = new Intl.NumberFormat('it-IT');
  var tiles = tile(nf.format(st.n), tab === 'wish' ? 'da comprare' : 'libri') +
    tile(eur(st.total), 'valore di copertina', st.noPrice ? 'senza prezzo: ' + st.noPrice : '') +
    (st.priced ? tile(eur(st.avg), 'prezzo medio') : '') +
    (st.paged ? tile(nf.format(st.pages), 'pagine', st.paged < st.n ? 'su ' + st.paged + ' libri' : '') : '') +
    (tab === 'lib' ? tile(String(st.loans.length), 'in prestito') : '') +
    (st.gone ? tile(String(st.gone), 'non più in libreria', [st.goneBy.v ? st.goneBy.v + (st.goneBy.v === 1 ? ' venduto' : ' venduti') : '', st.goneBy.r ? st.goneBy.r + (st.goneBy.r === 1 ? ' regalato' : ' regalati') : '', st.goneBy.s ? st.goneBy.s + (st.goneBy.s === 1 ? ' smarrito' : ' smarriti') : ''].filter(Boolean).join(' · ')) : '') +
    (tab === 'lib' && (st.read || st.reading || st.toRead) ? tile(String(st.read), 'letti', [st.reading ? st.reading + ' in lettura' : '', st.toRead ? st.toRead + ' da leggere' : ''].filter(Boolean).join(' · ')) : '') +
    (st.pagesRead ? tile(nf.format(st.pagesRead), 'pagine lette') : '') +
    (st.rated ? tile('★ ' + st.avgRating.toFixed(1).replace('.', ','), 'voto medio', 'su ' + st.rated + (st.rated === 1 ? ' libro' : ' libri')) : '') +
    (st.guess ? tile(String(st.guess), 'da verificare') : '');
  var loans = st.loans.length ? '<section class="st-sec"><h3>In prestito</h3><ul class="loans">' + st.loans.map(function (x) {
    return '<li><b>' + esc(x.p) + '</b> · ' + esc(x.t) + (x.pd ? ' <small>dal ' + esc(L.itDate(x.pd)) + ', ' + esc(L.agoText(Date.parse(x.pd))) + '</small>' : '') + '</li>';
  }).join('') + '</ul></section>' : '';
  $('#statsH').textContent = 'Statistiche · ' + (tab === 'wish' ? 'Desideri' : 'Libreria');
  $('#statsBody').innerHTML = '<div class="tiles">' + tiles + '</div>' + loans +
    barsHTML('Autori più presenti', st.topAuthors, true) + barsHTML('Case editrici', st.topPublishers, true) +
    barsHTML('Generi', st.topGenres, true) + barsHTML('Scaffali', st.topShelves, true) + barsHTML('Anno di pubblicazione, per decennio', st.byDecade, false) +
    barsHTML('Libri letti, per anno', st.byReadYear, false) +
    '<p class="msg">Tocca un nome per vedere quei libri.</p>';
  $('#statsSheet').hidden = false;
}
/* ---------- case editrici: uniforma i nomi ---------- */
var pubGroups = [];
function openPubs() {
  pubGroups = L.publisherGroups(state.books);
  if (!pubGroups.length) { toast('Non ho trovato case editrici scritte in modi diversi.'); return; }
  $('#pubList').innerHTML = pubGroups.map(function (g, gi) {
    return '<fieldset class="pgrp"><legend>' + g.total + ' libri</legend>' + g.names.map(function (x, ni) {
      var sel = x.name === g.suggested;
      return '<div class="pname"><label class="pr"><input type="radio" name="pg' + gi + '" value="' + ni + '"' + (sel ? ' checked' : '') + '><span><b>' + esc(x.name) + '</b> <small>' + x.count + (x.count === 1 ? ' libro' : ' libri') + '</small></span></label>' +
        '<label class="pc"><input type="checkbox" data-g="' + gi + '" data-n="' + ni + '" checked' + (sel ? ' disabled' : '') + '>cambia</label></div>';
    }).join('') + '</fieldset>';
  }).join('');
  $('#pubSheet').hidden = false;
}
function applyPubs() {
  var map = {};
  pubGroups.forEach(function (g, gi) {
    var r = document.querySelector('input[name="pg' + gi + '"]:checked');
    if (!r) return;
    var target = g.names[+r.value].name;
    g.names.forEach(function (x, ni) {
      var cb = document.querySelector('#pubList input[data-g="' + gi + '"][data-n="' + ni + '"]');
      if (x.name !== target && cb && cb.checked) map[x.name] = target;
    });
  });
  var snapshot = JSON.stringify(state.books), n = 0;
  state.books.forEach(function (b) { var t = map[(b.e || '').trim()]; if (t && b.e !== t) { b.e = t; n++; } });
  $('#pubSheet').hidden = true;
  if (!n) { toast('Nessun nome cambiato.'); return; }
  renderList(); touch(); updateSummary();
  toast('Uniformata la casa editrice di ' + n + (n === 1 ? ' libro.' : ' libri.'), { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot); renderList(); touch(); updateSummary(); } });
}
/* ---------- completa i dati mancanti (genere, pagine, copertina…) dei libri gia' inseriti ---------- */
var filling = false;
async function fillMissing() {
  if (filling) return;
  if (navigator.onLine === false) { toast('Sei offline. Riprova quando c\'è connessione.'); return; }
  var recent = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10), skipped = 0;
  var todo = state.books.filter(function (b) {
    if (!(L.toIsbn13(b.i) && !b.nf && !isBusy(b) && (!b.gen || !b.pg || !b.img || !b.e || !b.y || !b.a || !b.t))) return false;
    if (b.ck && b.ck >= recent) { skipped++; return false; }     // gia' cercato di recente: le banche dati non hanno di piu'
    return true;
  });
  if (!todo.length) { toast(skipped ? 'Questi libri sono già stati cercati negli ultimi 30 giorni: le banche dati non hanno altri dati.' : 'Non c\'è niente da completare.'); return; }
  filling = true;
  var btn = $('#btnFill'), done = 0, changed = 0, failed = 0;
  btn.disabled = true;
  toast('Cerco i dati mancanti di ' + todo.length + (todo.length === 1 ? ' libro…' : ' libri…'));
  await Promise.all(todo.map(function (b0) {
    return lookupPool(async function () {
      try {
        var r = await L.lookupIsbn(L.toIsbn13(b0.i), lookupOpts());
        var b = get(b0.id);
        if (b) b.ck = today();
        if (r && b) {
          var before = JSON.stringify(b);
          ['t', 'a', 'e', 'y', 'gen', 'pg'].forEach(function (k) { if (!b[k] && r[k]) b[k] = r[k]; });
          if (!b.img && r.img) b.img = r.img;
          if (JSON.stringify(b) !== before) changed++;
        }
      } catch (e) { failed++; }
      done++;
      btn.textContent = 'Completo… ' + done + '/' + todo.length;
    });
  }));
  filling = false;
  btn.disabled = false; btn.textContent = 'Completa genere, pagine e copertine';
  touch(); renderList(); updateSummary();
  toast('Completati ' + changed + ' libri' + (failed ? '; ' + failed + ' non riusciti (rete o limite di Google): riprova più tardi.' : '.'));
}

/* ---------- eventi ---------- */
var list = $('#list');
list.addEventListener('input', function (e) {
  var el = e.target, row = el.closest('.row');
  if (!row || row.dataset.ex || !el.dataset.k) return;
  var b = get(row.dataset.id);
  if (!b) return;
  var k = el.dataset.k;
  if (k === 'y') { var v = el.value.replace(/\D/g, '').slice(0, 4); if (v !== el.value) el.value = v; b.y = v; }
  else if (k === 'c') { b.c = L.parseNum(el.value); }
  else if (k === 'i') { var w = el.value.replace(/[^\dXx]/g, '').toUpperCase(); if (w !== el.value) el.value = w; b.i = w; }
  else if (k === 'pg') { var pv = el.value.replace(/\D/g, '').slice(0, 5); if (pv !== el.value) el.value = pv; b.pg = pv; }
  else { b[k] = el.value.replace(/\s*[\r\n]+\s*/g, ' '); if (el.tagName === 'TEXTAREA') autosize(el); }
  if (b.g.indexOf(k) >= 0) {
    b.g = b.g.filter(function (x) { return x !== k; });
    var f = el.closest('.f');
    if (f) { f.classList.remove('is-guess'); f.removeAttribute('title'); }
    var fl = row.querySelector('.flags');
    if (fl) fl.innerHTML = flagsHTML(b, computeDups());
  }
  touch(); updateSummary();
});
list.addEventListener('change', function (e) {
  var el = e.target;
  if (!el.dataset || !el.dataset.k) return;
  var row = el.closest('.row'), b = row && get(row.dataset.id);
  if (!b) return;
  if (el.dataset.k === 'c') el.value = b.c == null ? '' : L.fmtNum(b.c);
  if (el.dataset.k === 'i') {
    var code = L.toIsbn13(b.i);
    if (code) {
      b.i = code; el.value = code; b.nf = false;
      var other = findByIsbn(code);
      touch();
      if (!b.t && (!other || other.id === b.id)) { S[b.id] = Object.assign(S[b.id] || {}, { st: 'queued' }); refreshRow(b.id); lookupPool(function () { return doLookup(b.id); }); }
      else refreshRow(b.id);
    } else { refreshRow(b.id); }
    updateSummary();
  }
});
/* il riquadro Descrizione: ricorda se è aperto e alla prima apertura cerca il testo */
list.addEventListener('toggle', function (e) {
  var d = e.target;
  if (!d.classList || !d.classList.contains('desc')) return;
  descOpen[d.dataset.id] = d.open;
  if (d.open) loadDesc(d.dataset.id, false);
}, true);
list.addEventListener('keydown', function (e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && (((e.target.dataset.act === 'verify' || e.target.dataset.act === 'loan' || e.target.dataset.act === 'dup') && e.target.classList.contains('tag')) || (e.target.dataset.act === 'toggle' && e.target.classList.contains('sum')) || (e.target.dataset.act === 'zoom' && e.target.classList.contains('thumb')))) { e.preventDefault(); e.target.click(); return; }
  if (e.key === 'Enter' && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) { e.preventDefault(); e.target.blur(); }
});
list.addEventListener('click', function (e) {
  var cov = e.target.closest('.cover');
  if (cov) { openFromGrid(cov.dataset.id); return; }
  var btn = e.target.closest('[data-act]');
  if (!btn) return;
  if (btn.dataset.act === 'clearflt') { clearFilters(); return; }
  if (btn.dataset.act === 'typeadd') { openIsbnSheet(); return; }
  if (btn.dataset.act === 'way-scan') { $('#btnScan').click(); return; }
  if (btn.dataset.act === 'way-photo') { $('#btnPhoto').click(); return; }
  if (btn.dataset.act === 'way-type') { $('#btnType').click(); return; }
  if (btn.dataset.act === 'restore') { $('#fileBackup').click(); return; }
  var row = btn.closest('.row');
  if (!row) return;
  var id = row.dataset.id, act = btn.dataset.act;
  if (act === 'del') delBook(id);
  else if (act === 'retry') retryRow(id);
  else if (act === 'choose') openPick(id);
  else if (act === 'loan') openLoan(id);
  else if (act === 'toggle') toggleRow(id);
  else if (act === 'dup') openDup(id);
  else if (act === 'facet') applyFacet(btn.dataset.f, btn.dataset.v, btn.dataset.name);
  else if (act === 'towish') moveToWish(id);
  else if (act === 'fav') toggleFav(id);
  else if (act === 'share') { var sb = get(id); if (sb) openShare([sb], { kind: 'book' }); }
  else if (act === 'tolib') moveToLib(id);
  else if (act === 'addcopy') addCopy(id);
  else if (act === 'descretry') { var db = get(id); if (db) { db.dsn = 0; loadDesc(id, true); } }
  else if (act === 'descmore') { descFull[id] = true; paintDesc(id); }
  else if (act === 'descdel') { var dd = get(id); if (dd) { dd.ds = ''; dd.dsf = ''; dd.dsl = ''; dd.dsn = Date.now(); touch(); paintDesc(id); toast('Descrizione tolta'); } }
  else if (act === 'rs' || act === 'rt') setRead(id, act, btn.dataset.v);
  else if (act === 'author') { q = btn.dataset.q; $('#q').value = q; flt = ''; readFlt = ''; shFlt = ''; genFlt = ''; renderList(); updateSummary(); window.scrollTo({ top: 0 }); toast('Libri di ' + q + '. Svuota la ricerca per vederli tutti.'); }
  else if (act === 'zoom') openCover(id);
  else if (act === 'coverphoto') coverTap(id);
  else if (act === 'bought') moveToLib(id);
  else if (act === 'pricephoto') { priceId = id; warmPriceOcr(); $('#filePrice').click(); }
  else if (act === 'priceweb') {
    var pw = get(id);
    if (pw) window.open('https://www.google.com/search?q=' + encodeURIComponent((L.toIsbn13(pw.i) || [pw.t, pw.a].filter(Boolean).join(' ')) + ' prezzo di copertina libro'), '_blank', 'noopener');
  }
  else if (act === 'verify') {
    var vb = get(id);
    if (vb && vb.g.length) {
      var snap = vb.g.slice();
      vb.g = []; refreshRow(id); touch(); updateSummary();
      toast('Segnato come verificato.', { label: 'Annulla', fn: function () { var x = get(id); if (x) { x.g = snap; refreshRow(id); touch(); updateSummary(); } } });
    }
  }
  else if (act === 'web') {
    var wb = get(id);
    if (wb) window.open('https://www.google.com/search?q=' + encodeURIComponent((L.toIsbn13(wb.i) || wb.i) + ' libro'), '_blank', 'noopener');
  }
  else if (act === 'lookup') {
    var b = get(id);
    if (b) { b.nf = false; S[id] = Object.assign(S[id] || {}, { st: 'queued' }); refreshRow(id); lookupPool(function () { return doLookup(id); }); }
  }
});

function bindFile(sel, fn) {
  $(sel).addEventListener('change', function (e) {
    var files = Array.prototype.slice.call(e.target.files || []);
    e.target.value = '';
    if (files.length) fn(files);
  });
}
var priceId = null;
/* apre la scheda e mette il cursore nel campo Costo (dal tocco su «Scrivilo»: la tastiera si apre) */
function typeCost(id) {
  var b = get(id);
  if (!b) return;
  if (!isOpen(b)) { openState[id] = true; refreshRow(id); }
  var inp = document.getElementById('c-' + id);
  if (!inp) return;
  try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
  inp.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
bindFile('#filePrice', async function (f) {
  var id = priceId; priceId = null;
  var b = id && bookFor(id);
  if (!b) return;
  toast('Leggo il prezzo…');
  try {
    var canvas = await loadCanvas(f[0], 1280);
    var got = await readPrice(canvas, 3), pr = got ? got.v : null;
    b = bookFor(id);
    if (!b) return;
    id = b.id;
    if (pr == null) { toast('Non trovo il prezzo in questa foto: avvicinati al «€» stampato, oppure scrivilo.', { label: 'Scrivilo', fn: function () { typeCost(id); } }); return; }
    var old = b.c;
    b.c = pr; touch(); refreshRow(id); updateSummary();
    toast('Prezzo letto: ' + eur(pr) + '. Controllalo.', { label: 'Annulla', fn: function () { var x = get(id); if (x) { x.c = old; touch(); refreshRow(id); updateSummary(); } } });
  } catch (e) { toast('Non riesco a leggere la foto.', { label: 'Scrivilo', fn: function () { typeCost(id); } }); }
});
bindFile('#fileCam', function (f) { addPhotos(f, true); });
bindFile('#fileGal', function (f) {
  var n = Array.prototype.filter.call(f || [], function (x) { return !x.type || x.type.indexOf('image/') === 0; }).length;
  addPhotos(f, n === 1);                       // una foto sola: chiede anche il prezzo, come dalla fotocamera
  if (n > 1) toast((n > 60 ? 'Ne ho prese 60 su ' + n : 'Aggiunte ' + n + ' foto') + ': le riconosco una alla volta, intanto puoi continuare.');
});
$('#priceShot').addEventListener('click', function () { $('#priceAsk').hidden = true; priceId = askId; askId = null; $('#filePrice').click(); });
$('#priceSkip').addEventListener('click', function () { $('#priceAsk').hidden = true; askId = null; });
bindFile('#fileBackup', function (f) { restore(f[0]); });
$('#btnScan').addEventListener('click', startScan);
$('#btnPhoto').addEventListener('click', function () { $('#photoSheet').hidden = false; });
$('#photoCam').addEventListener('click', function () { $('#photoSheet').hidden = true; $('#fileCam').click(); });
$('#photoGal').addEventListener('click', function () { $('#photoSheet').hidden = true; $('#fileGal').click(); });
$('#photoClose').addEventListener('click', function () { $('#photoSheet').hidden = true; });
$('#btnType').addEventListener('click', openIsbnSheet);
$('#scanClose').addEventListener('click', function () { stopScan(false); });
$('#scanDone').addEventListener('click', function () { stopScan(false); });
$('#scanTorch').addEventListener('click', toggleTorch);
window.addEventListener('popstate', function () { if (scanning) { pushed = false; stopScan(true); } });
$('#isbnCancel').addEventListener('click', function () { $('#isbnSheet').hidden = true; });
$('#isbnGo').addEventListener('click', submitIsbn);
$('#pickClose').addEventListener('click', closePick);
$('#pickText').addEventListener('click', function () { var id = pickId; closePick(); if (id) applyOcrText(id); });
$('#pickList').addEventListener('click', function (e) {
  var b = e.target.closest('.cand');
  if (!b || pickId == null) return;
  var s = S[pickId], c = s && s.cands && s.cands[+b.dataset.i];
  var id = pickId;
  closePick();
  if (c) applyCandidate(id, c);
});
$('#copyClose').addEventListener('click', function () { $('#copySheet').hidden = true; });
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (drawerOpen) { closeDrawer(); return; }
  if (optOpen) { closeOptions(); return; }
  if (!$('#lightbox').hidden) { closeCover(false); return; }
  if (!$('#instSheet').hidden) { closeInstallHelp(); return; }
  if (!$('#covSheet').hidden) { closeCovAsk(); return; }
  if (!$('#svcSheet').hidden) { closeSvcShare(); return; }
  if (!$('#svcInSheet').hidden) { closeSvcImport(); return; }
  if (!$('#shareSheet').hidden) { closeShare(); return; }
  if (!$('#importSheet').hidden) { closeImport(); return; }
  ['#statsSheet', '#exportSheet', '#pubSheet', '#priceAsk', '#dupSheet', '#photoSheet'].forEach(function (k) { $(k).hidden = true; });
  if (!$('#loanSheet').hidden) closeLoan();
});
$('#q').addEventListener('input', function (e) { q = e.target.value; collapseCards(); renderList(); });
$('#sort').addEventListener('change', function (e) { sortBy = e.target.value; renderList(); });
$('#fltGuess').addEventListener('click', function () { flt = flt === 'guess' ? '' : 'guess'; collapseCards(); updateSummary(); renderList(); });
$('#fltLoan').addEventListener('click', function () {
  collapseCards();
  var on = !(flt === 'loan' && tab === 'lib');
  if (tab !== 'lib') setTab('lib');
  flt = on ? 'loan' : '';
  updateSummary(); renderList();
  if (on) toast(allLoansText());
});
function allLoansText() {
  var n = state.books.filter(function (b) { return !b.w && b.p; }).length;
  return n ? (n === 1 ? '1 libro in prestito.' : n + ' libri in prestito, dai più vecchi.') + ' Tocca di nuovo «Prestati» per vederli tutti.' : 'Nessun libro in prestito.';
}
$('#optOpenAll').addEventListener('change', function (e) { settings.openAll = e.target.checked; openState = {}; saveSettings(); renderList(); });
$('#tabLib').addEventListener('click', function () { setTab('lib'); });
$('#tabWish').addEventListener('click', function () { setTab('wish'); });
$('#btnView').addEventListener('click', function () { setView(settings.view === 'grid' ? 'list' : 'grid'); renderList(); });
$('#btnCheck').addEventListener('click', function () { startScan('check'); });
$('#btnStats').addEventListener('click', openStats);
$('#statsClose').addEventListener('click', function () { $('#statsSheet').hidden = true; });
$('#statsBody').addEventListener('click', function (e) {
  var r = e.target.closest('[data-q]');
  if (!r) return;
  q = r.dataset.q; $('#q').value = q; flt = '';
  $('#statsSheet').hidden = true;
  renderList(); updateSummary();
  window.scrollTo({ top: 0 });
});
function openExport() {
  var n = exportBooks().length;
  $('#exportMsg').textContent = n ? 'Esporto i ' + n + (n === 1 ? ' libro' : ' libri') + ' della scheda ' + (tab === 'wish' ? 'Desideri' : 'Libreria') + ', con le colonne che hanno dei dati.' : 'La scheda ' + (tab === 'wish' ? 'Desideri' : 'Libreria') + ' è vuota.';
  updateBackupInfo();
  $('#backupNote').textContent = '';
  prepBackup();
  $('#exportSheet').hidden = false;
}
$('#btnExport').addEventListener('click', openExport);
$('#exportClose').addEventListener('click', function () { $('#exportSheet').hidden = true; });
$('#btnXlsx').addEventListener('click', saveXLSX);
$('#btnShareBackup').addEventListener('click', shareBackup);
$('#loanCancel').addEventListener('click', closeLoan);
$('#loanSave').addEventListener('click', saveLoan);
$('#loanBack').addEventListener('click', returnLoan);
$('#loanKind').addEventListener('click', function (e) { var x = e.target.closest('[data-k]'); if (x) setLoanKind(x.dataset.k); });
$('#loanWho').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); saveLoan(); } });
$('#btnPubs').addEventListener('click', openPubs);
$('#pubCancel').addEventListener('click', function () { $('#pubSheet').hidden = true; });
$('#pubApply').addEventListener('click', applyPubs);
$('#pubList').addEventListener('change', function (e) {
  if (e.target.type !== 'radio') return;
  var gi = e.target.name.slice(2);
  document.querySelectorAll('#pubList input[data-g="' + gi + '"]').forEach(function (cb) { var me = cb.dataset.n === e.target.value; cb.disabled = me; if (me) cb.checked = true; });
});
$('#btnFill').addEventListener('click', fillMissing);
$('#btnMergeDups').addEventListener('click', mergeDups);
$('#dupCopies').addEventListener('click', dupCopies);
$('#dupMerge').addEventListener('click', dupMerge);
$('#dupUnmark').addEventListener('click', dupUnmark);
$('#dupClose').addEventListener('click', closeDup);
$('#btnShareWish').addEventListener('click', shareWish);
$('#btnPrint').addEventListener('click', printCatalog);
$('#sort').addEventListener('change', function () { if (drawerOpen) updateDrawerFoot(); });
$('#btnVerifyAll').addEventListener('click', function () {
  var snapshot = JSON.stringify(state.books), n = 0;
  state.books.forEach(function (b) { if (b.g.length) { b.g = []; n++; } });
  if (!n) { toast('Non ci sono libri da verificare.'); return; }
  if (flt === 'guess') flt = '';
  renderList(); touch(); updateSummary();
  toast(n + (n === 1 ? ' libro segnato come verificato.' : ' libri segnati come verificati.'), { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot); renderList(); touch(); updateSummary(); } });
});
$('#optExtra').addEventListener('change', function (e) { settings.extra = e.target.checked; saveSettings(); renderList(); });
$('#btnTodo').addEventListener('click', runTodo);
$('#btnCopy').addEventListener('click', copyTSV);
$('#btnCsv').addEventListener('click', saveCSV);
$('#btnBackup').addEventListener('click', backup);
$('#btnRestore').addEventListener('click', function () { $('#fileBackup').click(); });
$('#btnDiag').addEventListener('click', async function () {
  var out = $('#diagOut'), btn = $('#btnDiag');
  btn.disabled = true; out.hidden = false; out.textContent = 'Provo le banche dati…';
  try {
    var res = await L.diagnose(lookupOpts());
    out.innerHTML = res.map(function (r) { return '<div class="' + (r.ok ? 'diag-ok' : 'diag-bad') + '"><b>' + (r.ok ? '✓ ' : '✗ ') + r.name + '</b>: ' + esc(r.msg) + '</div>'; }).join('');
  } catch (e) { out.textContent = 'Prova non riuscita.'; }
  btn.disabled = false;
});
$('#btnGuessPub').addEventListener('click', function () {
  var snapshot = JSON.stringify(state.books), n = 0, sure = 0, missing = 0;
  state.books.forEach(function (b) {
    if (b.e || !L.toIsbn13(b.i)) return;
    var r = guessEditor(b);
    if (r) { n++; if (r === 'sure') sure++; } else missing++;
  });
  if (!n) { toast(missing ? 'Non riesco a dedurre le case editrici: servono altri libri dello stesso editore già completi.' : 'Tutti i libri hanno già la casa editrice.'); return; }
  renderList(); touch(); updateSummary();
  var unsure = n - sure;
  toast('Dedotte ' + n + (n === 1 ? ' casa editrice' : ' case editrici') + ' dall\'ISBN' + (sure ? ': ' + sure + (sure === 1 ? ' confermata' : ' confermate') + ' dai tuoi libri' : '') + (unsure ? (sure ? ', ' : ': ') + unsure + ' «Da verificare»' : '') + '.', { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot); renderList(); touch(); updateSummary(); } });
});
$('#btnInstDiag').addEventListener('click', async function () {
  var out = $('#instOut'), btn = $('#btnInstDiag');
  btn.disabled = true; out.hidden = false; out.textContent = 'Controllo…';
  var rows = [];
  function add(ok, name, msg) { rows.push('<div class="' + (ok ? 'diag-ok' : 'diag-bad') + '"><b>' + (ok ? '✓ ' : '✗ ') + esc(name) + '</b>: ' + esc(msg) + '</div>'); }
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone) rows.push('<div class="diag-ok"><b>✓ Stai già usando l\'app installata.</b></div>');
  var secureOk = location.protocol === 'https:' || location.hostname === 'localhost';
  add(secureOk, 'Indirizzo sicuro (https)',
    secureOk ? 'ok' : 'l\'indirizzo inizia con «' + location.protocol + '»: Chrome installa solo da indirizzi https (per esempio https://nome.netlify.app). Apri la versione pubblicata, non il file sul telefono o sul computer.');
  var ua = navigator.userAgent || '';
  var inApp = /; wv\)|FBAN|FBAV|Instagram|Line\/|Telegram|WhatsApp|GSA\/|Snapchat/i.test(ua);
  var other = /SamsungBrowser|OPR\/|Firefox|EdgA|Edg\/|DuckDuckGo|Brave/i.test(ua);
  add(/Chrome\//.test(ua) && !inApp && !other, 'Aperta in Google Chrome',
    inApp ? 'sembra aperta dentro un\'altra app (WhatsApp, Gmail, Telegram…): copia l\'indirizzo e aprilo direttamente in Chrome.'
      : (other || !/Chrome\//.test(ua)) ? 'non sembra Chrome: apri l\'indirizzo con Google Chrome.' : 'ok');
  var siteOk = secureOk;
  try {
    var reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    var swErr = '';
    if (!(reg && reg.active) && 'serviceWorker' in navigator) {
      try {
        reg = await navigator.serviceWorker.register('sw.js');
        await Promise.race([navigator.serviceWorker.ready, new Promise(function (_, no) { setTimeout(function () { no(new Error('non si attiva entro 6 secondi: probabilmente manca qualche file')); }, 6000); })]);
      } catch (e5) { swErr = (e5 && e5.message) || String(e5); }
      reg = await navigator.serviceWorker.getRegistration();
    }
    var swOk = !!(reg && reg.active);
    siteOk = siteOk && swOk;
    add(swOk, 'Funzionamento offline (service worker)', swOk ? 'attivo' : 'non parte' + (swErr ? ': ' + swErr : '') + '. Chiudi e riapri la pagina e ricontrolla; se resta cosi\' ricarica la cartella su Netlify (manca qualche file).');
  } catch (e) { siteOk = false; add(false, 'Funzionamento offline (service worker)', 'non disponibile in questo browser.'); }
  try {
    var mlink = document.querySelector('link[rel="manifest"]').href;
    var mr = await fetch(mlink, { cache: 'no-store' });
    var ct = mr.headers.get('content-type') || '';
    var mj = mr.ok ? await mr.json() : null;
    var icons = (mj && mj.icons) || [];
    var has = function (sz) { return icons.some(function (ic) { return (ic.sizes || '').split(/\s+/).indexOf(sz) >= 0; }); };
    var mOk = !!(mj && mj.name && mj.start_url && has('192x192') && has('512x512'));
    siteOk = siteOk && mOk;
    add(mOk, 'Scheda dell\'app (manifest)', mr.ok ? (mOk ? 'ok (' + (ct.split(';')[0] || 'tipo non indicato') + ')' : 'incompleta: mancano nome, start_url o icone 192 e 512 px')
      : (mr.status === 401 || mr.status === 403) ? 'errore ' + mr.status + ': il server rifiuta l\'accesso a questo file. Il sito sembra protetto (password o accesso riservato) oppure e\' un sito temporaneo non ancora collegato a un account: nelle impostazioni del sito su Netlify cerca la protezione con password / accesso riservato e disattivala, poi ricontrolla.'
      : 'errore ' + mr.status + ' nel caricarla: ricarica la cartella su Netlify.');
    var bad = [];
    for (var ii = 0; ii < icons.length; ii++) {
      try {
        var ir = await fetch(new URL(icons[ii].src, mlink).href, { cache: 'no-store' });
        var ict = ir.headers.get('content-type') || '';
        if (!ir.ok) bad.push(icons[ii].src + ' (errore ' + ir.status + ')');
        else if (!/image\//.test(ict)) bad.push(icons[ii].src + ' (non e\' un\'immagine: ' + (ict || 'tipo ignoto') + ')');
      } catch (e6) { bad.push(icons[ii].src + ' (non raggiungibile)'); }
    }
    siteOk = siteOk && !bad.length;
    add(!bad.length && icons.length > 0, 'Icone dell\'app', !icons.length ? 'nessuna icona nella scheda dell\'app.' : bad.length ? 'non si caricano: ' + bad.join(', ') + '. Ricarica la cartella intera su Netlify, cartella «icons» compresa.' : 'ok (' + icons.length + ')');
  } catch (e) { siteOk = false; add(false, 'Scheda dell\'app (manifest)', 'non riesco a leggerla.'); }
  try {
    var probes = ['manifest.json', 'style.css', 'sw.js', 'icons/next-libris-192.png'], res = [], odd = false;
    for (var pk = 0; pk < probes.length; pk++) {
      var st;
      try { st = (await fetch(probes[pk] + '?t=' + Date.now(), { cache: 'no-store' })).status; } catch (e7) { st = 'rete'; }
      if (st !== 200) odd = true;
      res.push(probes[pk].split('/').pop() + ' ' + st);
    }
    add(!odd, 'Accesso ai file del sito', res.join(', ') + (odd ? '. Se un file risponde 401 o 403 e gli altri 200, quel file e\' bloccato dal server: manda questo risultato.' : ''));
    if (odd) siteOk = false;
  } catch (e) {}
  var cv = (ua.match(/Chrome\/(\d+)/) || [])[1];
  add(!!deferred, 'Chrome ha offerto l\'installazione', deferred ? 'sì: ora puoi premere «Installa l\'app» qui sopra.'
    : (standalone ? 'non serve, è già installata.' : siteOk
      ? 'no, anche se la pagina è a posto. In questo caso il problema è nel telefono: Chrome crea l\'app tramite Google Play, quindi servono Play Store e «Google Play Services» aggiornati, con la connessione attiva' + (cv ? ' (Chrome ' + cv + ')' : '') + '. Aggiorna Chrome e Play Store, riavvia il telefono, riapri l\'indirizzo in Chrome e controlla di nuovo il menu (⋮).'
      : 'no: correggi prima le voci con ✗ qui sopra, poi ricarica la pagina.'));
  out.innerHTML = rows.join('');
  btn.disabled = false;
});
$('#gbKey').value = '';
$('#optPrice').addEventListener('change', function (e) { settings.price = e.target.checked; saveSettings(); toast(settings.price ? 'Dopo ogni libro ti chiederò il prezzo (puoi sempre saltarlo).' : 'Non chiederò più il prezzo: resta il tasto fotocamera sulla scheda del libro.'); });
/* l'indirizzo del worker si puo' incollare anche senza https:// o con ?isbn=... della prova a mano */
function cleanWorker(v) {
  v = String(v || '').trim().split(/[?#]/)[0].replace(/\/+$/, '');
  if (v && !/^[a-z][a-z0-9+.-]*:\/\//i.test(v) && /^[^\s/]+\.[a-z]{2,}(\/|$)/i.test(v)) v = 'https://' + v;
  return v;
}
$('#sbnUrl').addEventListener('change', function (e) {
  var v = cleanWorker(e.target.value), before = settings.sbnUrl;
  if (v && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(v)) { toast('L\'indirizzo deve iniziare con https:// (es. https://sbn-libri.tuonome.workers.dev).'); return; }
  if (v === before) { e.target.value = v; return; }
  e.target.value = v; setSvc('sbn', v);
  if (v) toast('Worker SBN in uso. Premi «Prova la ricerca ISBN» per controllare.');
  else toast('Worker tolto: ora cerco senza il catalogo SBN.', { label: 'Annulla', fn: function () { setSvc('sbn', before); } });
});
$('#gbKey').addEventListener('change', function (e) {
  var v = e.target.value.replace(/\s+/g, ''), before = settings.gbKey;
  if (v === before) { e.target.value = v; return; }
  e.target.value = v; setSvc('key', v);
  if (!v) toast('Chiave tolta: ora cerco su Google senza chiave.', { label: 'Annulla', fn: function () { setSvc('key', before); } });
  else toast(/^AIza[\w-]{30,}$/.test(v) ? 'Chiave in uso. Premi «Prova la ricerca ISBN» per controllare.' : 'Chiave in uso, ma non sembra una chiave Google (di solito inizia con AIza e ha 39 caratteri): controlla.');
});
function clearSvc(k) {
  var before = svcVal(k);
  if (!before) return;
  setSvc(k, '');
  toast(k === 'sbn' ? 'Worker tolto. Resta tra i salvati.' : 'Chiave tolta. Resta tra le salvate.',
    { label: 'Annulla', fn: function () { setSvc(k, before); } });
}
$('#sbnClear').addEventListener('click', function () { clearSvc('sbn'); });
$('#gbClear').addEventListener('click', function () { clearSvc('key'); });
$('#svcRestore').addEventListener('click', function () {
  var did = [];
  if (!settings.sbnUrl && saved.sbn[0]) { setSvc('sbn', saved.sbn[0]); did.push('sbn'); }
  if (!settings.gbKey && saved.key[0]) { setSvc('key', saved.key[0]); did.push('key'); }
  if (!did.length) return;
  toast(did.length === 2 ? 'Chiave e worker rimessi.' : did[0] === 'sbn' ? 'Worker rimesso.' : 'Chiave rimessa.',
    { label: 'Annulla', fn: function () { did.forEach(function (k) { setSvc(k, ''); }); } });
});
$('#svcSbn').parentNode.addEventListener('click', function (e) {
  var u = e.target.closest('.schip-use'), x = e.target.closest('.schip-x');
  if (u) {
    var k = u.dataset.k, v = saved[k][+u.dataset.i], before = svcVal(k);
    if (!v) return;
    setSvc(k, v);
    toast(k === 'sbn' ? 'Worker rimesso: ' + svcShort(k, v) + '.' : 'Chiave rimessa: ' + svcShort(k, v) + '.', { label: 'Annulla', fn: function () { setSvc(k, before); } });
  } else if (x) {
    var k2 = x.dataset.k, i2 = +x.dataset.forget, v2 = saved[k2][i2];
    if (!v2) return;
    saved[k2].splice(i2, 1); ls.set(LS_SAVED, JSON.stringify(saved)); renderSvc();
    toast((k2 === 'sbn' ? 'Worker tolto dai salvati.' : 'Chiave tolta dalle salvate.'), { label: 'Annulla', fn: function () { saved[k2].splice(i2, 0, v2); ls.set(LS_SAVED, JSON.stringify(saved)); renderSvc(); } });
  }
});
$('#btnClearGuess').addEventListener('click', function () {
  var snapshot = JSON.stringify(state.books), n = 0;
  state.books.forEach(function (b) {
    if (b.g.length) { b.g.forEach(function (k) { if (k !== 'i') b[k] = ''; n++; }); b.g = []; }
  });
  if (!n) { toast('Non ci sono ipotesi da svuotare.'); return; }
  renderList(); touch(); updateSummary();
  toast('Svuotate ' + n + ' ipotesi', { label: 'Annulla', fn: function () { state.books = JSON.parse(snapshot); renderList(); touch(); updateSummary(); } });
});
/* ---------- installazione e condivisione dell'app ---------- */
/* Finche' l'app si usa dal browser, in alto c'e' la scheda «Installa»: un tocco apre la richiesta di Chrome
   (quando Chrome la offre), altrimenti spiega i passi giusti per quel telefono e browser. */
/* indirizzo dell'app: quello da cui gira (cosi' link e condivisioni seguono un eventuale cambio di nome); di riserva quello pubblicato */
var APP_URL = /\.github\.io$/.test(location.hostname) ? location.origin + location.pathname.replace(/[^/]*$/, '') : 'https://piero907.github.io/next-libris/';
var APP_SCOPE = location.pathname.replace(/[^/]*$/, '');      // es. /next-libris/: l'app installata e' legata a questa cartella
var SHARE_TXT = 'Next Libris: il catalogo della libreria di casa. Inquadri il codice a barre e il libro si compila da solo. Aprilo con Chrome e premi «Installa».';
var deferred = null;
function isStandalone() {
  try {
    if (window.matchMedia && ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'].some(function (m) { return matchMedia('(display-mode: ' + m + ')').matches; })) return true;
  } catch (e) {}
  return navigator.standalone === true || /^android-app:\/\//.test(document.referrer || '');
}
function browserKind() {
  var ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/; wv\)|FBAN|FBAV|Instagram|Line\/|Telegram|WhatsApp|GSA\/|Snapchat/i.test(ua)) return 'inapp';
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/Firefox/i.test(ua)) return 'firefox';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}
function updateInstallUi() {
  var inst = isStandalone();
  if (inst && (!settings.installed || settings.instScope !== APP_SCOPE)) { settings.installed = true; settings.instScope = APP_SCOPE; saveSettings(); }   // l'app installata e Chrome condividono i dati: da qui in poi niente scheda
  var kind = browserKind();
  var show = !inst && !settings.installed && Date.now() - settings.instSnooze > 14 * 86400000;
  $('#instCard').hidden = !show;
  $('#instGo').textContent = kind === 'inapp' && !deferred ? 'Apri in Chrome' : 'Installa';
  $('#instMsg').textContent = kind === 'inapp' && !deferred
    ? 'Sei dentro un\'altra app: aprila in Chrome per averla tra le app del telefono, a schermo intero e anche senza rete.'
    : 'Avrai l\'icona tra le app del telefono: si apre a schermo intero e funziona anche senza rete.';
  $('#btnInstall').hidden = inst;
  $('#instOkTxt').hidden = !inst;
}
var INST_STEPS = {
  android: { lead: 'Chrome non ha ancora proposto l\'installazione: si fa dal suo menu.',
    steps: ['Tocca <b>⋮</b> in alto a destra.', 'Scegli <b>Installa app</b> (su alcuni telefoni <b>Aggiungi a schermata Home</b>, poi <b>Installa</b>).', 'Conferma: l\'icona di Next Libris compare tra le app.'],
    note: 'Se nel menu c\'è <b>Apri in Chrome</b>, sei dentro un\'altra app (Gmail, Telegram…): toccalo e poi premi «Installa» qui in alto. Se nel menu c\'è <b>Apri app</b>, è già installata.' },
  inapp: { lead: 'Il link si è aperto dentro un\'altra app, che non può installarla. Serve Chrome.',
    steps: ['Tocca <b>⋮</b> (i tre puntini) in alto a destra.', 'Scegli <b>Apri in Chrome</b> o <b>Apri nel browser</b>.', 'In Chrome premi <b>Installa</b> nella scheda in alto.'],
    note: 'Se non trovi la voce, copia il link e incollalo nella barra degli indirizzi di Chrome.', copy: true, chrome: true },
  ios: { lead: 'Su iPhone e iPad si aggiunge alla schermata Home da Safari.',
    steps: ['Tocca <b>Condividi</b> (il quadrato con la freccia in su).', 'Scorri e scegli <b>Aggiungi alla schermata Home</b>.', 'Tocca <b>Aggiungi</b>.'],
    note: 'Se la voce non c\'è, copia il link e aprilo in Safari.', copy: true },
  samsung: { lead: 'In Samsung Internet si fa dal menu in basso.',
    steps: ['Tocca il menu <b>≡</b> in basso a destra.', 'Scegli <b>Aggiungi pagina a</b>, poi <b>Schermata Home</b>.', 'Conferma con <b>Aggiungi</b>.'],
    note: 'In alternativa apri il link in Chrome: lì basta premere «Installa».', copy: true },
  firefox: { lead: 'In Firefox si fa dal menu.',
    steps: ['Tocca <b>⋮</b>.', 'Scegli <b>Installa</b> o <b>Aggiungi alla schermata principale</b>.', 'Conferma.'],
    note: 'In alternativa apri il link in Chrome: lì basta premere «Installa».', copy: true },
  desktop: { lead: 'Sul computer si installa da Chrome o Edge.',
    steps: ['Nella barra dell\'indirizzo, a destra, clicca l\'icona <b>Installa</b>.', 'Se non c\'è: menu <b>⋮</b> › <b>Trasmetti, salva e condividi</b> › <b>Installa pagina come app</b>.', 'Conferma con <b>Installa</b>.'],
    note: 'Sul telefono è più comoda: apri Opzioni › Condividi l\'app e inquadra il QR code.' }
};
var instPushed = false;
function openInstallHelp() {
  var k = browserKind(), h = INST_STEPS[k], reuse = false;
  if (optOpen) { reuse = optPushed; optPushed = false; $('#optSheet').hidden = true; optOpen = false; }   // dalle Opzioni: il foglio prende il loro posto
  $('#instLead').textContent = h.lead;
  $('#instSteps').innerHTML = h.steps.map(function (x) { return '<li><span>' + x + '</span></li>'; }).join('');
  $('#instNote').innerHTML = h.note;
  $('#instCopy').hidden = !h.copy;
  var ch = $('#instChrome');
  ch.hidden = !(h.chrome && /Android/i.test(navigator.userAgent || ''));
  ch.href = 'intent://' + APP_URL.replace(/^https:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(APP_URL) + ';end';
  $('#instWhy').hidden = k !== 'android' && k !== 'desktop';
  $('#instSheet').hidden = false;
  if (reuse) { try { history.replaceState({ inst: 1 }, ''); instPushed = true; } catch (e) {} }
  else if (!instPushed) { try { history.pushState({ inst: 1 }, ''); instPushed = true; } catch (e) {} }
  $('#instOk').focus({ preventScroll: true });
}
function closeInstallHelp(fromPop) {
  if ($('#instSheet').hidden) return;
  $('#instSheet').hidden = true;
  if (instPushed && !fromPop) { instPushed = false; try { history.back(); } catch (e) {} }
  else instPushed = false;
}
window.addEventListener('popstate', function () { if (!$('#instSheet').hidden) { instPushed = false; closeInstallHelp(true); } });
async function doInstall() {
  if (!deferred) { openInstallHelp(); return; }
  var d = deferred, out = null;
  d.prompt();
  try { out = await d.userChoice; } catch (e) {}
  deferred = null;
  if (out && out.outcome === 'dismissed') toast('Va bene. Quando vuoi: Menu › Opzioni › App.');
  updateInstallUi();
}
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; updateInstallUi(); });
window.addEventListener('appinstalled', function () {
  deferred = null; settings.installed = true; settings.instScope = APP_SCOPE; saveSettings(); updateInstallUi();
  toast('Next Libris è installata: la trovi tra le app del telefono.');
});
$('#btnInstall').addEventListener('click', doInstall);
$('#instGo').addEventListener('click', doInstall);
$('#instLater').addEventListener('click', function () {
  settings.instSnooze = Date.now(); saveSettings(); updateInstallUi();
  toast('Quando vuoi: Menu › Opzioni › App.', { label: 'Annulla', fn: function () { settings.instSnooze = 0; saveSettings(); updateInstallUi(); } });
});
$('#instOk').addEventListener('click', function () { closeInstallHelp(); });
$('#instSheet').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeInstallHelp(); });
$('#instCopy').addEventListener('click', copyAppLink);
$('#instWhy').addEventListener('click', function () {
  var had = instPushed; instPushed = false; $('#instSheet').hidden = true;
  openOptions('app', had);
  setTimeout(function () { $('#btnInstDiag').click(); }, 60);
});
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {}
  try {
    var ta = document.createElement('textarea');
    ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    var ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}
async function copyAppLink() {
  toast(await copyText(APP_URL) ? 'Link copiato: incollalo in WhatsApp, in un messaggio o in una mail.' : 'Non riesco a copiarlo. Il link è ' + APP_URL);
}
async function shareApp() {
  if (navigator.share) {
    try { await navigator.share({ title: 'Next Libris', text: SHARE_TXT, url: APP_URL }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  copyAppLink();
}
$('#shareApp').addEventListener('click', shareApp);
$('#copyApp').addEventListener('click', copyAppLink);
if (window.matchMedia) { try { var smq = matchMedia('(display-mode: standalone)'); var onSm = function () { updateInstallUi(); }; if (smq.addEventListener) smq.addEventListener('change', onSm); else if (smq.addListener) smq.addListener(onSm); } catch (e) {} }
function resumeLookups(silent) {
  var waiting = state.books.filter(function (b) { var s = S[b.id]; return s && s.st === 'wait'; });
  waiting.forEach(function (b) { var s = S[b.id]; clearTimeout(s.timer); s.st = 'queued'; refreshRow(b.id); lookupPool(function () { return doLookup(b.id); }); });
  var n = waiting.length + todoRows().length;
  if (todoRows().length) runTodo();
  if (n && !silent) toast('Di nuovo online: cerco ' + n + (n === 1 ? ' libro rimasto in attesa.' : ' libri rimasti in attesa.'));
  return n;
}
window.addEventListener('online', function () { persist(); offlineNoted = false; resumeLookups(false); });
window.addEventListener('offline', persist);
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { clearTimeout(tSave); persist(); } });
var rz = null;
window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { autosizeAll(list); }, 150); });

/* ---------- avvio ---------- */
loadAll();
saveSettings();                                  // salva subito eventuali scelte aggiornate (es. palette predefinita)
loadSaved();
renderSvc();
$('#optName').value = settings.name || '';
renderOwner();
$('#optPrice').checked = settings.price;
$('#optExtra').checked = settings.extra;
$('#optOpenAll').checked = settings.openAll;
setView(settings.view);
loadQuota();
applyLook(false);
updateInstallUi();
setTimeout(function () {
  checkVersion().then(function (j) {
    if (j && j.v > APP_VERSION.v) notice('È disponibile la versione ' + j.v + ' dell\'app (stai usando la ' + APP_VERSION.v + ').', 'Aggiorna adesso', updateNow);
  });
}, 2500);
confirmLearnedPublishers();
if (!settings.swiped) setTimeout(function () { var t = $('#edgeTab'); t.classList.add('nudge'); setTimeout(function () { t.classList.remove('nudge'); }, 3000); }, 1500);
setTab('lib');
updateBackupInfo();
loadCovers();
setTimeout(function () { if (navigator.onLine !== false) { var n = resumeLookups(true); if (n) toast('Cerco ' + n + (n === 1 ? ' libro rimasto in attesa.' : ' libri rimasti in attesa.')); } }, 1200);
setTimeout(checkLoanNag, 2500);
try { if (navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then(function (p) { if (!p && state.books.length >= 5) askPersist(); }); } catch (e) {}
updateSummary();
persist();
checkIncoming();
/* schermata d'apertura (solo app installata): resta almeno ~0,7 s dall'avvio, poi sfuma */
(function () {
  var el = document.getElementById('splash');
  if (!el || !document.documentElement.hasAttribute('data-splash')) { if (el) el.remove(); return; }
  if (settings.name) $('#splashWho').textContent = 'Libreria di ' + settings.name;
  // tempo fisso da quando l'app e' pronta: la schermata di Android copre la pagina finche' non e' caricata
  setTimeout(function () {
    document.documentElement.classList.add('splash-out'); el.classList.add('out');
    setTimeout(function () { el.remove(); document.documentElement.removeAttribute('data-splash'); document.documentElement.classList.remove('splash-out'); applyLook(false); }, 380);
  }, 600);
})();
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(function () {});
}
window.__app = { readPrice: function (c, r) { return readPrice(c, r); }, filtersAll: function () { return { frFlt: frFlt, autFlt: autFlt, edFlt: edFlt, genFlt: genFlt, shFlt: shFlt, q: q }; }, openDrawer: openDrawer, closeDrawer: closeDrawer, openOptions: function (s) { openOptions(s || 'search'); }, closeOptions: function () { closeOptions(); }, filters: function () { return { flt: flt, readFlt: readFlt, shFlt: shFlt, genFlt: genFlt, sortBy: sortBy }; }, state: state, S: S, openState: function () { return openState; }, addIsbn: addIsbn, addPhotos: addPhotos, settings: settings, setTab: setTab, onScanned: onScanned, startScan: startScan,
  get scanning() { return scanning; }, setScanMode: function (m) { scanMode = m; }, setScanKind: setScanKind, get scanKind() { return scanKind; } };
})();
