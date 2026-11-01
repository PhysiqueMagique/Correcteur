/* Correcteur — fonctionnement hors ligne.
   Ce fichier ne fait que garder une copie de l'outil sur l'appareil.
   Il ne voit jamais les rapports, l'audio ni les commentaires : ceux-ci ne passent pas par le réseau.

   Mise à jour : si vous modifiez seulement index.html, rien à faire (la page est revérifiée à chaque ouverture en ligne).
   Si vous modifiez un autre fichier (lib/, icons/, manifest), changez VERSION ci-dessous. */
const VERSION = '2026-11-01b';
const CACHE = 'correcteur-' + VERSION;
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'lib/pdf.min.js', 'lib/pdf.worker.min.js', 'lib/lame.min.js', 'lib/jszip.min.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('correcteur-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  e.respondWith(isPage ? networkFirst(req) : cacheFirst(req));
});

// La page : la version en ligne si possible (pour recevoir vos mises à jour), sinon la copie gardée.
async function networkFirst(req){
  const cache = await caches.open(CACHE);
  const net = fetch(req, {cache: 'no-cache'}).then(res => { if (res.ok) cache.put(req, res.clone()); return res; });
  net.catch(() => {});
  try {
    return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error('lent')), 4000))]);
  } catch {
    return (await cache.match(req, {ignoreSearch: true})) || (await cache.match('index.html')) || (await cache.match('./')) || net;
  }
}
// Les bibliothèques et icônes : la copie gardée (rapide, et fonctionne sans internet).
async function cacheFirst(req){
  const hit = await caches.match(req, {ignoreSearch: true});
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok){ const cache = await caches.open(CACHE); cache.put(req, res.clone()); }
  return res;
}
