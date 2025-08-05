---
title: Serverless URL shorter using cloudflare workers and pages
date: "2023-11-11"
published: false  
tags: ['cloudflare', 'react','javascript']
coverImage: "/assets/blog/images/url-shorter.png"
excerpt: "I'v always wanted to try cloudflare workers and build something interesting but i didn't get any cool idea, until now ..."
ogImage:
  url: "/assets/blog/images/url-shorter.png"
---

I'v always wanted to try cloudflare workers and build something interesting but i didn't get any cool idea, until now i've decided to build a simple url shorter using workers as backend and pages as frontend and KV store as simple database.

 The process was straight forward the frontend was built with react, all the logic is done in the worker, it's not that much a single endpoint no fancy routing, check the type of request if it's POST it means that we are shortening a url do the logic and return a JSON response to the frontend, else if it's GET request we are trying to resolve a short url check if it's in the KV store or not the redirect to it.


```javascript

async function handleRequest(request) {
        if (request.method === "OPTIONS") {
                return  handleOptions(request)
        }
    if (request.method == 'POST'){
       return await createNewShortUrl(request)
    }
      return await getUrlData(request)   
}
```