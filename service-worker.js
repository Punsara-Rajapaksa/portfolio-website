const CACHE_NAME = "portfolio-v3";
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "assets/Punsara-Rajapaksa-Resume.pdf",
  "assets/projects/clovio/screenshot-1.png",
  "assets/projects/clovio/screenshot-2.png",
  "assets/projects/clovio/demo.mp4",
  "assets/projects/buildwith-ai/screenshot-1.png",
  "assets/projects/buildwith-ai/screenshot-2.png",
  "assets/projects/buildwith-ai/demo.mp4",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
