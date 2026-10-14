/* AMEIN – service worker: faz o site abrir sem internet e ser instalado como app.
   Ao mudar algo importante neste arquivo, aumente o número da versão abaixo. */
const VERSAO = 'amein-v1';
const BASE = ['./', 'index.html', 'og.jpg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (u.hostname.endsWith('supabase.co')) return;           /* banco de dados: sempre direto da internet */
  if (u.origin === location.origin && u.pathname.startsWith('/audio/')) {
    if (u.pathname.endsWith('.json')) return e.respondWith(daRede(r));
    return;                                                  /* MP3: deixa o navegador cuidar (funciona melhor no iPhone) */
  }
  if (u.pathname.endsWith('gerador-voz.html')) return;       /* ferramenta do administrador: sem cache */
  if (r.mode === 'navigate') return e.respondWith(daRede(r, 'index.html'));
  if (u.origin === location.origin && (u.pathname.endsWith('.html') || u.pathname.endsWith('/'))) return e.respondWith(daRede(r));
  if (u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return e.respondWith(rapido(r));
});

/* Página e lista de vozes: tenta a internet primeiro (para pegar a versão nova); sem internet, usa a cópia guardada. */
async function daRede(r, reserva) {
  const c = await caches.open(VERSAO);
  try {
    const resp = await fetch(r);
    if (resp.ok) c.put(reserva || r, resp.clone());
    return resp;
  } catch (e) {
    return (await c.match(reserva || r)) || (await c.match(r)) || Response.error();
  }
}
/* Imagens, ícones e fontes: usa a cópia guardada e atualiza por trás. */
async function rapido(r) {
  const c = await caches.open(VERSAO), g = await c.match(r);
  const novo = fetch(r).then(resp => { if (resp.ok || resp.type === 'opaque') c.put(r, resp.clone()); return resp; }).catch(() => g);
  return g || novo;
}
