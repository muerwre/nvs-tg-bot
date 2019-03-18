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

// emo \[(\d+)\] (([\d]?\s?)+)

bot.action(/emo \[(\d+)\]/, async (ctx) => {
  const { message = {}, from = {} } = ctx && ctx.update && ctx.update.callback_query || { };
  const { match = [] } = ctx;
  const emo_id = (match[1] && parseInt(match[1])) || 0;

  if (!message.message_id || !from.id) return;

  const user_id = from.id;
  const message_id = message.message_id;

  console.log({ emo_id });

  const vote = await Vote.findOne({ user_id, message_id });

  console.log({ vote });

  if (!vote) {
    await Vote.create({ user_id, message_id, emo_id }, (err, result) => {
      return result.toObject();
    });
  } else {
    await vote.set({ emo_id }).save();
  }

  const emos = await Vote.find({ message_id }).then(result => (
    result.reduce((obj, emo) => ({
      ...obj,
      [emo.emo_id]: (obj[emo.emo_id] || 0) + 1,
    }), {})
  ));

  const list = Object.keys(EMOTIONS).map((em, i) => (
    emos[i] || 0
  ));

  await ctx.editMessageText(message.text, makeKB(list)).catch(() => false);
});

bot.launch();

export default bot;
