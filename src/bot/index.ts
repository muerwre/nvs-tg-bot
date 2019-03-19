import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";
import { Vote } from "../models/Vote";
import { Post } from "../models/Post";

const SocksProxyAgent = require('socks-proxy-agent');
const Telegraf = require('telegraf');

const agent = (CONFIG.PROXY && new SocksProxyAgent(CONFIG.PROXY)) || null;
const options = {
  channelMode: true,
  telegram: { agent },
  agent,
};

const bot = new Telegraf(CONFIG.TELEGRAM.key, options);

bot.on('message', async (ctx, next) => {
  // console.log("GOT IT!", ctx.message.chat.id);
  // return await ctx.replyWithAnimation('https://media.giphy.com/media/LrmU6jXIjwziE/giphy.gif');
});

// emo \[(\d+)\] (([\d]?\s?)+)

bot.action(/emo \[(\d+)\]/, async (ctx) => {
  const { message = {}, from = {} } = ctx && ctx.update && ctx.update.callback_query || { };
  const { match = [] } = ctx;
  const emo_id = (match[1] && parseInt(match[1])) || 0;

  if (!message.message_id || !from.id) return;

  const user_id = from.id;
  const message_id = message.message_id;
  const chat_id = message.chat.id;

  const vote = await Vote.findOne({ user_id, message_id, chat_id });
  console.log({ vote });

  if (vote) {
    console.log('will update vote');
    await vote.set({ emo_id }).save();
  } else {
    console.log('will create vote');
    await Vote.create({ user_id, message_id, emo_id, chat_id });
  }

  // count all likes from db by type
  const emos = await Vote.find({ message_id, chat_id }).then(result => (
    result.reduce((obj, emo) => ({
      ...obj,
      [emo.emo_id]: (obj[emo.emo_id] || 0) + 1,
    }), {})
  ));

  console.log('getting emos for this post', { emos });

  // create like array filled with likes from db
  const list = Object.keys(EMOTIONS).map((em, i) => (emos[i] || 0));

  const post = await Post.findOne({ chat_id, message_id });
  const { map_url = null, post_url = null, is_cutted = false } = post;

  const extras = { inline_keyboard: makeKB(list, { map_url, post_url, is_cutted }) };

  await ctx.editMessageReplyMarkup(extras).catch(console.log);
});

bot.launch();

export default bot;
