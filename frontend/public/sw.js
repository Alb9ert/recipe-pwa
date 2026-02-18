self.addEventListener("fetch", (event) => {
  // Just fetch everything from the network, no caching at all
  event.respondWith(fetch(event.request));
});
