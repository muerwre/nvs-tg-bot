import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";
import { Vote } from "../models/Vote";
import { Post } from "../models/Post";
import { throttle } from "throttle-debounce";

const SocksProxyAgent = require("socks-proxy-agent");
const Telegraf = require("telegraf");

const agent = (CONFIG.PROXY && new SocksProxyAgent(CONFIG.PROXY)) || null;
const options = {
  channelMode: true,
  telegram: { agent },
  agent
};

const bot = new Telegraf(CONFIG.TELEGRAM.key, options);

bot.command("ping", async (ctx, next) => {
  return await ctx.reply(`pong`);
});

if (CONFIG.REACTIONS && CONFIG.REACTIONS.length) {
  CONFIG.REACTIONS.map(({ match, from, reply }) => {
    if (!reply || !match) return;

    bot.hears(
      match,
      throttle(60000, async (ctx, next) => {
        if (
          ctx.message.from.is_bot ||
          (!!from && from !== ctx.message.from.username)
        ) {
          return next();
        }

        await ctx.reply(reply, { reply_to_message_id: ctx.message.message_id });
        return next();
      })
    );
  });
}

bot.action(/emo \[(\d+)\]/, async ctx => {
  const { message = {}, from = {} } =
    (ctx && ctx.update && ctx.update.callback_query) || {};
  const { match = [] } = ctx;
  const emo_id = (match[1] && parseInt(match[1])) || 0;

  if (!message.message_id || !from.id) return;

  const user_id = from.id;
  const message_id = message.message_id;
  const chat_id = message.chat.id;

  const vote = await Vote.findOne({ user_id, message_id, chat_id });

  if (vote) {
    await vote.set({ emo_id }).save();
  } else {
    await Vote.create({ user_id, message_id, emo_id, chat_id });
  }

  // count all likes from db by type
  const emos = await Vote.find({ message_id, chat_id }).then(result =>
    result.reduce(
      (obj, emo) => ({
        ...obj,
        [emo.emo_id]: (obj[emo.emo_id] || 0) + 1
      }),
      {}
    )
  );

  // create like array filled with likes from db
  const list = Object.keys(EMOTIONS).map((em, i) => emos[i] || 0);

  const post = await Post.findOne({ chat_id, message_id });
  const {
    map_url = null,
    post_url = null,
    is_cutted = false,
    topic_url = null,
    album_url = null
  } = post || {};

  const extras = {
    inline_keyboard: makeKB(list, {
      map_url,
      post_url,
      is_cutted,
      topic_url,
      album_url
    })
  };

  await ctx.editMessageReplyMarkup(extras).catch(console.log);
});

bot.launch();

export default bot;