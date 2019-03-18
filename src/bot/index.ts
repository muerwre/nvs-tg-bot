import { CONFIG } from "$config/server";

const SocksProxyAgent = require('socks-proxy-agent');
const Telegraf = require('telegraf');

const agent = new SocksProxyAgent(CONFIG.PROXY);
const options = {
  channelMode: true,
  telegram: { agent },
  agent,
};

const bot = new Telegraf(CONFIG.TELEGRAM.key, options);

bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('modern', ({ reply }) => reply('Yo'));
bot.command('hipster', Telegraf.reply('λ'));

bot.on('message', function (ctx, next) {
  console.log("GOT IT!", ctx.message.chat.id);
});

bot.launch();
//
// bot.sendMessage(CONFIG.TELEGRAM.chat, 'hihi :-)');

// const telegram = new Telegram(token, [options])

export default bot;
