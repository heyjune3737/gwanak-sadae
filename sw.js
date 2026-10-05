// 오늘 사대 — 오프라인 캐시 (네트워크 우선, 안 되면 저장본)
const C='sadae-v68';
const SHELL=['./','index.html','config.js','manifest.webmanifest','icon-192.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;
  e.respondWith(fetch(e.request.url,{cache:'no-cache'}).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
// 폰 알림 (sadae-push 가 보냄) — 누르면 앱을 열고 그 화면으로
self.addEventListener('push',e=>{ let d={}; try{ d=e.data?e.data.json():{}; }catch(x){ d={body:e.data&&e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title||'오늘 사대',{body:d.body||'',icon:'icon-192.png',tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||'./'}})); });
self.addEventListener('notificationclick',e=>{ e.notification.close(); const url=new URL((e.notification.data&&e.notification.data.url)||'./', self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{ for(const c of cs){ if(c.url.startsWith(self.registration.scope)){ c.postMessage({type:'open',url}); return c.focus(); } } return clients.openWindow(url); })); });
