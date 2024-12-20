const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
        "/",
        "/index.html",
        "/g-0.png",
        "/g-1.png",
        "/g-2.png",
        "/g-3.png",
        "/g-4.png",
        "/g-5.png",
        "/g-6.png",
        "/g-7.png",
        "/g-8.png",
        "/g-9.png",
        "/g-10.png",
        "/g-11.png",
        "/g-12.png",
        "/g-13.png",
        "/g-14.png",
        "/image.png",
        "/po.png",
        "/404.html",
        "/networkError.html",
        ]),
    );
});

const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};
  
const cacheFirst = async ({ request, fallbackUrl }) => {
    try {
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            return responseFromCache;
        }
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            fallbackResponse.status = "408";
            fallbackResponse.headers.set("Content-Type", "text/html");
            return fallbackResponse;
        }
        // when even the fallback response is not available,
        // there is nothing we can do, but we must always
        // return a Response object
        return new Response("Uh oh, we can't even access the fallback resource! Please fix your network.", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
  };
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      cacheFirst({
        request: event.request,
        fallbackUrl: "networkError.html",
      }),
    );
  });  
