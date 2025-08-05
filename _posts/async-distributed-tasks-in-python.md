---
title: Async Distributed tasks in python with Celery
date: "2022-05-02"
published: true
tags: ['python', 'celery']
coverImage: "/assets/blog/images/celery.png"
excerpt: "I was working on a project where we need to collect data from domains, since..."
ogImage:
  url: "/assets/blog/images/celery.png"
---


I was working on a project where we need to collect data from domains, since whe have thousands of domains and each domain require a number of tasks in order to collect the needed data, this isn't a job for one machine no matter how powerful it is, it's better to distribute the load between number of machines.

### Ray
[Ray](https://www.ray.io/) was the top candidate for this job, but unfortunately we faced so many issues with it and it never worked out as we want.

### Celery
A colleague suggested using [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html) it was designed to work and integrated with python web frameworks like django and flask, but hey i thing we could use it this way :). 

#### getting started

let's work on scenario where we have a task the take 5 sec to complete

``` python
from time import time,sleep

def task():
    sleep(5)


start = time()
task()
end = time()

print(f"time taken: {round(end - start)} seconds")

```

if we run this of course it will take 5 seconds, but what if we need to run this task on let's say 20 domains, let's see the output:

```code
time taken: 100 seconds
```

again nothing strange as we know in python unless we don't use threads the event loop will be blocked, if in a case we need to run this like a couple of time we could simply use threads, but we need to run this on a scale.

Ok, let move on to celery, this a basic app with minimal configuration you probably should head to their docs.

```python
from time import sleep
from celery import Celery

app = Celery(broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

@app.task
def task():
    sleep(5)
```

and now we start celery as worker using the command

```bash
celery -A index worker --loglevel=info --pool=threads -c 100
```

we should get something like this 

```bash
[tasks]
[2022-05-02 23:09:16,403: INFO/MainProcess] Connected to redis://localhost:6379/0
[2022-05-02 23:09:16,406: INFO/MainProcess] mingle: searching for neighbors
[2022-05-02 23:09:17,417: INFO/MainProcess] mingle: all alone
[2022-05-02 23:09:17,438: INFO/MainProcess] celery@pc ready.
```


now we have one worker ready to consume tasks, of course we need multiple worker or else we haven't done any thing spacial, i will run it two more times so the total number of workers is 3.
to execute task on celery we call `task.delay()` it return `AsyncResult` object, we call `get()` or `wait()` on it to wait for its execution and get any return if it has. 

```python
from time import time
from index import task

results = []
start = time()
for i in range(20):
    results.append(task.delay())

for result in results:
    result.get()
end = time()

print(f"time taken: {round(end - start)} seconds")
```
in the above example we run the task 10 times which in the normal case should take 100 seconds, let see the improvement we made. 

```code
time taken: 5 seconds
```

wow! from 100 to only just 5 seconds, of course this a simple example real life way complicated, but we get the idea.
I know this not beginners friendly tutorial the goal is just to show case celery and what it can do. 

