---
title: Bulk Rename, my first npm package
date: "2021-12-20"
published: true
tags: ['npm', 'node']
coverImage: "/assets/blog/images/npm-svg.png"
excerpt: "I was a windows guy for a long time, when i moved to linux i am not gonna lie i missed some applications from windows.."
ogImage:
  url: "/assets/blog/images/npm-svg.png"
---


I was a windows guy for a long time, when i moved to linux i am not gonna lie i missed some applications from windows, one of them is a bulk rename application i used to download a lot of anime and series to match them with subtitles i need to rename all of them it hard to do manually but the app was a live saver.
when i moved to linux i couldn't fine an good alternative, so i've decided to make my own. it's a basic cli made with nodejs.

#### Installation
`
npm i -g bulk-rename-node
`

#### Usage
`
bulk-rename --help
`

#### output

```bash

bulk-rename <cmd> [args]

Commands:
  bulk-rename list     List files in current directory
  bulk-rename replace  Replace substring with another string
  bulk-rename delete   Delete substring from filename
  bulk-rename insert   Insert substring into filename

Options:
  --version  Show version number                                       [boolean]
  --ext      Extension of files to work on             [string] [default: "all"]
  --help     Show help  

```
comments and pull request are welcomed

[Github Repository](https://github.com/Almadih/bulk-rename-node)