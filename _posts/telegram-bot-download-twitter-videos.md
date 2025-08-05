---
title: Download Videos from twitter using telegram bot
date: "2022-05-27"
published: true
tags: ['python', 'google cloud','telegram','cloud functions']
coverImage: "/assets/blog/images/twitter.jpg"
excerpt: "I normally don't like to download whole app just to do a simple thing, I tried to download a video from twitter..."
ogImage:
  url: "/assets/blog/images/twitter.jpg"
---

I normally don't like to download whole app just to do a simple thing, I tried to download a video from twitter first thing came in my mind is telegram, because there is a bot for everything, well i found one and it was unreliable. So i said let me make my own!.  

### Twitter API

The first problem came in my way is twitter api, to use it you must have developer account and to be honest i've applied because i have many ideas for twitter, but i got rejected and i haven't try again.
I tried to find another way and luckily i found this [repository](https://github.com/Almadih/twitter-videos-downloader-bot.git) it use indirect way to access the api and it work like a charm.

### Deployment 

deploying a telegram bot was always a problem from me since it need to run always on a server (this before i discover the perfect situation to use webhooks), recently i activated my google cloud account and now i can try the power of serverless functions!.
So the structure of the project is Http-triggered cloud function which act as webhook for the bot, every time the bot receive a message the function called.  

### Code
Here is the link to the [repository](https://github.com/Almadih/twitter-videos-downloader-bot) you can find all technical stuff there.
And here is the [bot](https://t.me/twitter_vid_dl_bot) if you want to try .