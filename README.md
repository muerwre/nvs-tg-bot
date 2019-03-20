# Vk to Telegram repost bot, that uses VK Callback API

That's just my own bot, configured for personal needs, but you can find here good 
examples of Telegram Bot API and Telegraf.js usage (i.e. VK to TG reposts with emoji votes)

Now it can: forward posts with votes, notify you about group joins/expells and post suggestions. Multiple TG channels supported;

## Setup
First, clone the repo: 
```git clone https://github.com/muerwre/nvs-tg-bot.git
cd nvs-tg-bot
npm i
```

Configure the bot:
```
cp ./config/server.example.ts ./config/server.ts
vi ./config/server.ts
```

Next, get group_id and verification code from VK: you need Callback API tab at your group preferences.

You should obtain bot token from BotFather https://core.telegram.org/bots.

Run it in the background as I do:

```/usr/bin/forever start -c "npm run dev" --sourceDir /opt/nvs-tg-bot/ .```
