
var cacheStorageKey = 'minimal-pwa-3';
var cacheList=[
  '/',
  'index.html',
  'main.css',
  'icon-default-192.png',
  'icon-default-512.png'
];
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache){
        cache.addAll(cacheList);
    }).then(function(){
        self.skipWaiting();
    })
  )
})
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
      alert(response)
        return response
      }
      return fetch(e.request.url)
    })
  )
})
self.addEventListener('activate',function(e){
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
  alert("tgg")
})
var alert=function(txt){
    self.clients.matchAll().then(function (clients) {
        if (clients && clients.length) {
            clients.forEach(function (client) {
                // 发送字符串
                client.postMessage(txt);
            })
        }
    })
}
self.addEventListener('message', function (event) {
    console.log(event.data); // 输出：'sw.updatedone'
    alert(444)
});
