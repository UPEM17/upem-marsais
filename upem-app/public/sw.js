self.addEventListener('install', e=>{
  e.waitUntil(caches.open('upem-v1').then(c=>c.addAll(['/','/manifest.webmanifest'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});

// === Push notifications (si activées côté serveur) ===
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const title = data.title || 'UPEM';
  const options = {
    body: data.body || 'Nouvelle information UPEM',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.matchAll({type:'window'}).then(list=>{
    for(const c of list){ if(c.url.endsWith(url) && 'focus' in c) return c.focus(); }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
