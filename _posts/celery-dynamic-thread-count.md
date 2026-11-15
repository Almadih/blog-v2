---
title: Dynamic Number of Threads in Celery
date: "2022-08-02"
published: true
tags: ['python', 'celery']
series: true
coverImage: "/assets/blog/images/celery.png"
canonical_url: false
excerpt: "I guess this a followup to the previous post, where i talked about celery and some.."
description: "How to stop Celery workers from overloading small servers by calculating the worker thread count from each machine's CPU and RAM in a start-up script."
ogImage:
  url: "/assets/blog/images/celery.png"
---

I guess this a followup to the [previous post](/posts/async-distributed-tasks-in-python), where i talked about celery and some pref and examples about it, i think this could be a series where i show the problems i faced during the project and how i overcome them.

## The problem
The project is running in multiple servers with different amount of resources, the mistake i did is running celery with fixed number of threads in all servers this cause smaller servers to hang since the receive huge number of tasks larger thant their resources.

## The solution
Solution is very simple i came up with an equation to calculate threads number based on amount of CPUs and Ram the server has. 

```shell
#worker.sh
cpus=$(nproc --all)
ram=$(free -g | awk '/^Mem:/{print $2}')
threads=$((cpus*15 + ram*15))

celery -A celery_app.tasks worker --loglevel=info --pool=threads -c $threads

```

the `15` here is arbitrary number, of course this should be determined carefully based on tasks type and wight.  