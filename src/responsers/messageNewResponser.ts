import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { cutText, makeDialogUrl, makePostUrl, parseAttachments } from "../utils/vk_media";
import { INewPostObject } from "./newPostResponser";
import { Message } from "../models/Message";

interface IMessageNewObject {
  type: string,
  object: {
    id: number,
    date: number,
    out: number,
    user_id: number,
    read_state: number,
    title: string,
    body: string,
    emoji: number
  },
  group_id: number,
  secret: string,
}

export const messageNewResponser = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  console.log('chat?', chat);
  if (!chat) return;

  const { object, group_id } = req.body as IMessageNewObject;
  const { user_id } = object;
  const timestamp = Date.now();

  const exist = await Message.findOne({ group_id, user_id, chat });

  if (exist) {
    console.log(timestamp - exist.timestamp);
    const delta = timestamp - exist.timestamp;

    await exist.set({ timestamp }).save();

    if (delta <= CONFIG.POSTS.new_message_delay) return true;
  } else {
    await Message.create({ group_id, user_id, chat, timestamp });
  }

  const { body } = object;
  await bot.telegram.sendMessage(
    chat,
    cutText(`<b>Новое сообщение:</b> ${body}`, CONFIG.POSTS.new_message_char_limit),
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Посмотреть диалог', url: makeDialogUrl(group_id, user_id) }
        ]],
      },
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  ).catch(() => false);

  return true;
};
