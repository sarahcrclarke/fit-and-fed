/* Fit & Fed service worker — offline app shell. Plain JS, served as-is from /public. */

const VERSION = 'v1'
const SHELL_CACHE = `fit-and-fed-shell-${VERSION}`
const RUNTIME_CACHE = `fit-and-fed-runtime-${VERSION}`

/** Enough to boot the app with no network. Hashed build assets are cached on first use. */
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // One bad URL shouldn't fail the whole install, so add them individually.
      Promise.all(
        SHELL_ASSETS.map((asset) =>
          cache.add(new Request(asset, { cache: 'reload' })).catch(() => undefined),
        ),
      ),
    ),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting()
})

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => undefined)
  return hit ?? (await network) ?? Response.error()
}

/** Navigations go to the network first so an updated shell lands promptly. */
async function handleNavigation(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE)
      cache.put('./index.html', response.clone())
    }
    return response
  } catch {
    const cache = await caches.open(SHELL_CACHE)
    // Any in-app route resolves to the SPA shell; React Router takes it from there.
    const shell = (await cache.match('./index.html')) ?? (await cache.match('./'))
    if (shell) return shell
    return new Response('Offline', { status: 503, statusText: 'Offline' })
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  // Vite emits content-hashed filenames, so those are safe to serve from cache forever.
  if (url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE))
    return
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
})
