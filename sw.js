const VERSION='opoasturias-v5-study-plan-20260909';
const BASE=new URL('./',self.location.href);
const CACHE=VERSION+':'+BASE.pathname;
const FILES=['./','./index.html','./styles.css','./app.js','./state.js','./study.js','./study-ui.js','./android.js','./manifest.webmanifest','./data/catalog.json','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./COBERTURA.md'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new URL(f,BASE).href)))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('opoasturias-')&&name.endsWith(':'+BASE.pathname)&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==BASE.origin||!u.pathname.startsWith(BASE.pathname))return;
  e.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(e.request);if(hit)return hit;try{const response=await fetch(e.request);return response;}catch(error){if(e.request.mode==='navigate')return await cache.match(BASE.href);throw error;}})());
});
