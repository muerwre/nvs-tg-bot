import { CONFIG } from "$config/server";
import { makeKB } from "../utils/merkup";

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

bot.action(/emo (\d+) (\d+) (\d+) (\d+)/, async (ctx) => {
  const { message = {} } = ctx && ctx.update && ctx.update.callback_query || { };
  const { match = [] } = ctx;

  if (!message.message_id || match.length < 5) return;

  console.log('continue');

  const omg = parseInt(match[1]) || 0;
  const sad = parseInt(match[2]) || 0;
  const think = parseInt(match[3]) || 0;
  const yeah = parseInt(match[4]) || 0;

  console.log({ omg, sad, think, yeah });

  await ctx.editMessageText(message.text, makeKB(omg, sad, think, yeah));
  //   , {
  //   parse_mode: 'Markdown',
  //   message_id: message.message_id,
  //   chat_id: message.chat.id,
  //   reply_markup: { inline_keyboard: makeKB(likes, dislikes) },
  //   // {
  //   //   inline_keyboard: [[{
  //   //     text: `kkkzxczxc ${~~(Math.random() * 10000)}`,
  //   //     callback_data: `like 0 dislike 0`
  //   //   }]]
  //   // }
  // }
  // )
  //
  // console.log(ctx.editMessageReplyMarkup);

  // await ctx.editMessageReplyMarkup(
  //   makeKB(likes, dislikes),
  // );

});

bot.action('dislike', (ctx) => {
  console.log('got it :-) (dislike)', ctx);
  ctx.editMessageText('🎉 Dislike :-(! 🎉');
});

bot.launch();
//
// bot.sendMessage(CONFIG.TELEGRAM.chat, 'hihi :-)');

// const telegram = new Telegram(token, [options])

export default bot;
