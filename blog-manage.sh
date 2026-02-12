#!/bin/bash

# Simple blog management helper for Almadih

POSTS_DIR="/home/almadih/Desktop/Work/personal/blog-v2/_posts"

case $1 in
    "new")
        if [ -z "$2" ]; then
            echo "Usage: ./blog-manage.sh new \"Post Title\""
            exit 1
        fi
        
        TITLE=$2
        SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -s ' ' '-' | tr -cd '[:alnum:]-')
        DATE=$(date +"%Y-%m-%d")
        FILENAME="${POSTS_DIR}/${SLUG}.md"
        
        cat <<EOF > "$FILENAME"
---
title: "$TITLE"
date: "$DATE"
published: false
tags: []
coverImage: "/assets/blog/images/placeholder.png"
excerpt: ""
ogImage:
  url: "/assets/blog/images/placeholder.png"
---

Drafted by Jarvis on $(date)
EOF
        echo "Created new draft: $FILENAME"
        ;;
    "list")
        ls -lt "$POSTS_DIR" | head -n 10
        ;;
    *)
        echo "Commands: new, list"
        ;;
esac
