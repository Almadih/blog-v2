---
title: Web Share Target API in a Next.js PWA
date: "2026-01-31"
published: true
tags: ['nextjs','pwa','typescript']
coverImage: "/assets/blog/images/nextjs-pwa.png"
excerpt: "In modern web development, Progressive Web Apps (PWAs) are closing the gap between web and native applications. One of the most powerful features to achieve this is the.."
ogImage:
  url: "/assets/blog/images/nextjs-pwa.png"
---



## Implementing the Web Share Target API in a Next.js PWA

In modern web development, Progressive Web Apps (PWAs) are closing the gap between web and native applications. One of the most powerful features to achieve this is the **Web Share Target API**. This API allows your PWA to appear in the native share sheet of the operating system, making it possible for users to "share" content—like images or text—directly from other apps into yours.

In this post, I'll walk through how we implemented this feature in BayanPlus to allow users to share bank receipts directly into their dashboard.

## 1. Registering the Share Target in the Manifest

The first step is to tell the browser that your app is capable of handling shared content. This is done in the `manifest.json` (or `manifest.ts` in Next.js).

```typescript
// src/app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // ... other manifest properties
    share_target: {
      action: "/share-target",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        files: [
          {
            name: "file",
            accept: ["image/*"],
          },
        ],
      },
    },
  };
}
```

Here, we define:
- `action`: The URL that will receive the share request.
- `method`: We use `POST` because we are sharing files.
- `enctype`: Must be `multipart/form-data` for file uploads.
- `params`: Specifies that we expect a file named `file` with an image mime-type.

## 2. Intercepting the Request in the Service Worker

When a user shares a file, the browser sends a `POST` request to `/share-target`. However, since this is a PWA, we want to handle this request even if the user is offline or if we want to provide a smoother transition. We use the Service Worker to intercept this `POST` request.

```typescript
// worker/index.ts
self.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname.endsWith("/share-target")) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const file = formData.get("file");

          if (file instanceof File) {
            const cache = await caches.open("shared-files");
            // Store the file in the Web Cache API
            await cache.put("/shared-image", new Response(file));
          }

          // Redirect to the dashboard with a query parameter
          const redirectUrl = new URL("/dashboard?shared=1", self.location.origin).href;
          return Response.redirect(redirectUrl, 303);
        } catch (error) {
          console.error("Service Worker: Error handling share-target:", error);
          const errorUrl = new URL("/dashboard?error=share_failed", self.location.origin).href;
          return Response.redirect(errorUrl, 303);
        }
      })(),
    );
  }
});
```

### Why a 303 Redirect?
We use a `303 See Other` status code. This is crucial because it tells the browser to perform a `GET` request to the redirection target, effectively converting the `POST` share into a `GET` navigation to our dashboard.

## 3. Retrieving the Shared File in the Frontend

Once the user is redirected to `/dashboard?shared=1`, our React components take over. We check for the `shared` parameter and, if present, reach into the Web Cache to retrieve the file we stored earlier.

```tsx
// src/app/(dashboard)/dashboard/_components/upload-receipt-form.tsx
useEffect(() => {
  if (searchParams.get("shared") === "1") {
    const handleSharedFile = async () => {
      try {
        const cache = await caches.open("shared-files");
        const response = await cache.match("/shared-image");
        if (response) {
          const blob = await response.blob();
          const file = new File([blob], "shared-receipt.jpg", {
            type: blob.type || "image/jpeg",
          });
          
          // Set the file in our form state and open the dialog
          setFormData((prev) => ({ ...prev, file }));
          setIsOpen(true);

          // Clean up: remove the file from cache and shared flag from URL
          await cache.delete("/shared-image");
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete("shared");
          router.replace(`/dashboard?${newParams.toString()}`);
        }
      } catch (error) {
        console.error("Error retrieving shared file:", error);
      }
    };
    handleSharedFile();
  }
}, [searchParams, router]);
```

## 4. The Fallback Route

While the Service Worker handles the interception, it's good practice to have a server-side route handler at `/share-target` in case the Service Worker isn't active or fails.

```typescript
// src/app/(dashboard)/share-target/route.ts
import { redirect } from "next/navigation";

export async function POST() {
  // If the SW fails to intercept, we fall back to a standard redirect
  return redirect("/dashboard?error=share_fallback");
}

export async function GET() {
  return redirect("/dashboard");
}
```

## Conclusion

Implementing the Share Target API transforms your PWA from a simple website into a deeply integrated tool on the user's device. By combining the Manifest, Service Worker redirection, and the Web Cache API, we created a seamless experience where sharing a receipt is as easy as sharing a photo with a friend.

This pattern is robust because:
1. It handles large file transfers via `POST`.
2. It uses the Service Worker to avoid actual server uploads until the user is ready.
3. It provides a clean UI flow where the shared item automatically opens in the relevant form.
