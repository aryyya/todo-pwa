workbox.skipWaiting()
workbox.clientsClaim()

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
