import "reflect-metadata";
import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";
import { Vote } from "../entity/Vote";
import { Post } from "../entity/Post";
import { rollResponser } from "../responsers/rollResponser";
import Axios from "axios";

const SocksProxyAgent = require("socks-proxy-agent");
const Telegraf = require("telegraf");

const agent = (CONFIG.PROXY && new SocksProxyAgent(CONFIG.PROXY)) || null;
const options = {
  channelMode: true,
  telegram: { agent },
  agent
};

const bot = new Telegraf(CONFIG.TELEGRAM.key, options);

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const url = `${CONFIG.FEATURES.SEARCH.URL}${encodeURIComponent(inlineQuery.query)}`;
  const response = await Axios.get(url);

  console.log({ url })
  console.log({ data: response.data.routes })

  const routes =
    response && response.data && response.data.routes
      ? response.data.routes
          .filter(({ address }) => address)
          .map(({ address, title, distance, description }) => ({
            type: "article",
            id: address,
            title,
            description: `${title} (${distance}км)\n${CONFIG.FEATURES.SEARCH.HOST}${address}`,
            input_message_content: {
              message_text: `${title} (${distance}км)\n${CONFIG.FEATURES.SEARCH.HOST}${address}`
            }
          }))
      : [];

  console.log(routes);
  return answerInlineQuery(routes, { disable_web_page_preview: true }); 
  // return answerInlineQuery([]); 
});

bot.command("ping", async (ctx, next) => {
  return await ctx.reply(`pong`);
});

bot.hears(/^\/roll\s?(\d{0,})\s?(\d{0,})?/gim, rollResponser);

bot.action(/emo \[(\d+)\]/, async ctx => {
  const { message = {}, from = {} } =
    (ctx && ctx.update && ctx.update.callback_query) || {};

  const { match = [] } = ctx;
  const emo_id = (match[1] && parseInt(match[1])) || 0;

  if (!message.message_id || !from.id) return;

  const user_id: number = from.id;
  const message_id: number = message.message_id;
  const chat_id: number = message.chat.id;

  const vote = await Vote.findOne({ where: { user_id, message_id, chat_id } });

  if (vote) {
    vote.emo_id = emo_id;
    await vote.save();
  } else {
    await Vote.create({
      user_id,
      message_id,
      emo_id,
      chat_id: chat_id.toString()
    }).save();
  }

  // count all likes from db by type
  const emos = await Vote.find({
    where: { message_id, chat_id: chat_id.toString() }
  }).then(result =>
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

  const post = await Post.findOne({
    where: { chat_id: chat_id.toString(), message_id }
  });
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
