---
title: Convert sync code to async in python
date: "2022-12-24"
published: true
tags: ['python', 'async','asyncio']
coverImage: "/assets/blog/images/asyncio.webp"
excerpt: "Asynchronous programming has become increasingly popular in recent years, as it allows you to write code that can perform multiple tasks concurrently."
ogImage:
  url: "/assets/blog/images/asyncio.webp"
---

## Introduction

Asynchronous programming has become increasingly popular in recent years, as it allows you to write code that can perform multiple tasks concurrently. This can be especially useful when working with tasks that involve waiting for a response, such as making HTTP requests or accessing a database.

In Python, you can write asynchronous code using the asyncio module and the async/await syntax. In this post, we'll go over how to convert sync code to async in Python and some best practices to follow when writing async code.

### Identify blocking code
The first step in converting sync code to async is to identify the code that is blocking the main thread and causing it to wait for a response. This can include things like making HTTP requests, reading and writing to databases, or accessing the file system.

For example, consider the following sync code that makes an HTTP request using the requests library:

```python 
import requests

def get_data():
    response = requests.get("https://example.com/api/endpoint")
    data = response.json()
    return data
```
This code will block the main thread until the HTTP request has completed and the response has been received. To convert this code to async, we'll need to use an async library like aiohttp instead of the sync requests library.
but if there is no alternatives, (and this the reason why i am writing this post), you can use asyncio to convert for example a third party library to be async lets say we want to run the above code multiple times, with it current form it surly will wait until the first run end and move to the next, to overcome this we can make the following changes:

```python
import requests
import asyncio
def get_data():
    response = requests.get("https://example.com/api/endpoint")
    data = response.json()
    return data

async def main():
    #get the current running event loop
    loop = asyncio.get_event_loop()
    #list to store pending coroutines 
    results = []
    for i in range(10):
        #pass the target function to the executer, and its params if available 
        results.append(loop.run_in_executor(None,get_data))
    #here is the blocking part where we wait for all pending results
    results = await asyncio.gather(*results)

if __name__ == "__main__":
    asyncio.run(main())

```

`loop.run_in_executor` is a method provided by the asyncio module in Python that allows you to run a function concurrently in a separate thread or process. It's commonly used to run sync code concurrently with async code, as sync code can block the event loop and prevent other async tasks from running.

### Conclusion
Converting sync code to async in Python can be a challenging task, but the benefits of async programming make it well worth the effort. By using the asyncio module and async libraries, and following best practices like avoiding sync code and thoroughly testing your code, you can write efficient, concurrent Python code that can scale to handle high levels of traffic and workload.