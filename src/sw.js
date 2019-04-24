workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  new RegExp('https:.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'cdn-cache'
  })
)

workbox.routing.registerRoute(
  new RegExp('http://.*:4567.*\.json'),
  workbox.strategies.networkFirst({
    cacheName: 'api-cache'
  })
)

self.addEventListener('install', event => {
  console.log('install event fired')

  const asyncInstall = new Promise(resolve => {
    resolve()
  })

  event.waitUntil(asyncInstall)
})

self.addEventListener('activate', event => {
  console.log('activate event fired')
})

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
