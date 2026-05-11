/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, CacheFirst, NetworkOnly, ExpirationPlugin } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      // Cache course materials (PDFs, images) aggressively
      matcher: ({ url }) => url.pathname.includes("/materials/") || url.pathname.endsWith(".pdf"),
      handler: new CacheFirst({
        cacheName: "zimplar-materials",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    {
      // Real-time classroom and API routes should always go to network
      matcher: ({ url }) => url.pathname.startsWith("/api/livekit") || url.pathname.includes("/classroom/"),
      handler: new NetworkOnly(),
    }
  ],
});

serwist.addEventListeners();
