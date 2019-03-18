import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";
import { Vote } from "../models/Vote";

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
  const user_id = from.id;
  const message_id = message.message_id;

  console.log({ emotions, message, from });

  const vote = await Vote.findOne({ user_id, message_id });

  console.log({ vote });

  if (!vote) {
    console.log('new vote :-)');

    await Vote.create({ user_id, message_id, emo_id: 1 }, (err, result) => {
      return result.toObject();
    });

    await ctx.editMessageText(message.text, makeKB(emotions)).catch(() => false);
  } else {
    console.log('user already voted');
  }

});

bot.launch();

export default bot;
