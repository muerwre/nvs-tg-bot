import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";

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

bot.action(/emo (([\d]?\s?)+)/, async (ctx) => {
  const { message = {}, from = {} } = ctx && ctx.update && ctx.update.callback_query || { };
  const { match = [] } = ctx;
  const datas = match && match[1] && match[1].split(' ');

  if (!message.message_id || !from.id || !datas || datas.length < 1) return;

  const emotions = datas.slice(0, Object.keys(EMOTIONS).length).map(emo => (parseInt(emo) || 0));

  console.log({ emotions });

  await ctx.editMessageText(message.text, makeKB(emotions)).catch(() => false);
});

bot.launch();

export default bot;
