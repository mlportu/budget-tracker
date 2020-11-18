const APP_PREFIX = 'Budget-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    '/js/index.js',
    '/js/idb.js',
    '/index.js',
    '/css/style.css',
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
]


self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
  })

self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });

        console.log(cacheKeeplist);
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });

  self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
              console.log('responding with cache : ' + e.request.url)
              return request
            } else {
              console.log('file is not cached, fetching : ' + e.request.url)
              return fetch(e.request)
          }
          
          // You can omit if/else for console.log & put one line below like this too.
          // return request || fetch(e.request)
          })
    )
  })