/**
 * Registers the offline service worker.
 *
 * Only runs for production builds: in dev the worker would serve stale modules and
 * fight Vite's HMR.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const url = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(url, { scope: import.meta.env.BASE_URL }).catch(() => {
      // Registration fails on insecure origins and in some private modes; the app
      // still works online, it just won't be available offline.
    })
  })
}
