---
title: Telegram Bot on Cloudflare Workers
date: "2025-08-06"
published: true
tags: ['cloudflare','telegram','typescript']
coverImage: "/assets/blog/images/cloudflare-telegram.webp"
excerpt: "Building telegram bots is like a passion of mine, but always had a problem with the hosting, you either pay for a server so.."
ogImage:
  url: "/assets/blog/images/cloudflare-telegram.webp"
---


Building telegram bots is like a passion of mine, but always had a problem with the hosting, you either pay for a server so it's running all the time or use some kind of serverless solution like google cloud functions, check my previous post about [telegram bot on google cloud functions](/posts/telegram-bot-download-twitter-videos). But to be honest wasn't smooth experience at all.

## Cloudflare Workers

[Cloudflare workers](https://workers.cloudflare.com) is a serverless platform, it's really easy to use, you can deploy your code in a few minutes and the free tier is very generous, so i decided to try it.
The problem was all available telegram packages are not compatible with cloudflare workers, luckily i found [this](https://github.com/codebam/cf-workers-telegram-bot) great package which is compatible with workers and it's really easy to use, so i didn't have to make my own solution.
The first thing i did is rebuilding my old [X/Twitter downloader bot](https://t.me/twitter_vid_dl_bot), the old was written in python and the new one is written in typescript.

## Code

The structure is fairly simple, cloudflare workers has fetch function as entry point, inside it i call a function which handles everything from initializing and handling various events.
```typescript
import initBot from './bot';
 export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        await initBot(request, env);
		return new Response('Hello World!');
	},
};
```

and here what `initBot` function looks like
```typescript
import TelegramBot, { TelegramExecutionContext } from '@codebam/cf-workers-telegram-bot';
import { welcome, handleVideoLink, isChatMember, sendSubscriptionMessage, handleCallbackQuery } from './commands';

const initBot = async (request: Request, env: Env) => {
	const bot = new TelegramBot(env.BOT_TOKEN);
	await bot
		.on(':message', async (bot: TelegramExecutionContext) => {
			await bot.sendTyping();
			const isMember = await isChatMember(bot.update.message?.from?.id.toString()!, env);
			if (!isMember) {
				await sendSubscriptionMessage(bot, env);
				return new Response('ok');
			}
			if (bot.update_type === 'message') {
				await handleVideoLink(bot, env);
			}
			return new Response('ok');
		})
		.on(':callback', async (bot: TelegramExecutionContext) => {
			await handleCallbackQuery(bot, env);
			return new Response('ok');
		})
		.on('start', async (bot: TelegramExecutionContext) => {
			await welcome(bot, env);
			return new Response('ok');
		})
		.handle(request.clone());
};

export default initBot;
```

the biggest change is in how the bot fetches the video from X, the old method was tedious and has many steps and was inconsistent, new method is much simpler and more readable, here is the code
```typescript
import { load } from 'cheerio';

export async function downloadVideo(url: string) {
	//make sure it's valid url
	try {
		new URL(url);
	} catch (error) {
		throw new Error('Please send valid URL');
	}

	const newUrl = url.replace('x.com', 'twitter.com');

	const parsedUrl = new URL(newUrl);

	if (parsedUrl.hostname !== 'twitter.com') {
		throw new Error('invalid Twitter URL');
	}

	return fetch(newUrl.replace('twitter.com', 'vxtwitter.com'), {
		headers: {
			'User-Agent': 'TelegramBot (like TwitterBot)',
		},
	})
		.then(async (response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch tweet: ${response.status}`);
			}

			return response.text();
		})
		.then((html) => {
			const $ = load(html);

			const getMetaContent = (name: string) => {
				const value = $(`meta[name="twitter:${name}"]`).attr('content') ?? $(`meta[property="og:${name}"]`).attr('content');
				return value;
			};

			const videoUrl = getMetaContent('video');
			if (!videoUrl) {
				throw new Error('Video not found');
			}
			return videoUrl;
		});
}

```

## Conclusion

The bot has been running smoothly for a while now, it has considerable amount of active users and it's been very useful for me, i'm planning to add more features to it, like downloading multiple videos from a single message, adding more commands and more.

![](/assets/blog/images/cloudflare-snapshot.png "number of requests for the past 30 days.")
> number of requests for the past 30 days.


If you want to try the bot, you can find it [here](https://t.me/twitter_vid_dl_bot).