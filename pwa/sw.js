//importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheStorageKey = 'minimal-pwa-1'
var cacheList=[
  '/',
  'index.html',
  'main.css',
  'youhun.jpg'
]
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache){
        cache.addAll(cacheList);
    }).then(function(){
        self.skipWaiting();
    })
  )
})