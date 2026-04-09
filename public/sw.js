const CACHE_NAME = 'mc-v1'
const SHELL = ['/admin', '/manifest.json']

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL)))
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})
