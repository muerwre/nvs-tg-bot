import { CONFIG } from '~/config/server';
import bot from '../bot';
import * as express from 'express';
import { cutText, makeDialogUrl } from '../utils/vk_media';
import { Message } from '../entity/Message';
import { getUserName, setOnlineStatus } from '../utils/vk_api';
import { text } from 'body-parser';

interface IMessageNewObject {
  type: string;
  object: {
    id: number;
    date: number;
    out: number;
    user_id: number;
    read_state: number;
    title: string;
    body: string;
    emoji: number;
  };
  group_id: number;
  secret: string;
}

export const messageNewResponser = async (
  req: express.Request & { body: IMessageNewObject },
  res: express.Response,
  chat?: string
): Promise<boolean> => {
  if (!chat) return;

  const { object, group_id } = req.body;
  const { user_id } = object;
  const timestamp = Date.now();

  const exist = await Message.findOne({ where: { group_id, user_id, chat } });

  if (exist) {
    console.log(timestamp - exist.timestamp);
    const delta = timestamp - exist.timestamp;

    exist.timestamp = timestamp;
    await exist.save();

    if (delta <= CONFIG.POSTS.new_message_delay) return true;
  } else {
    await Message.create({ group_id, user_id, chat, timestamp }).save();
  }

  const name = await getUserName(user_id);
  const link = name
    ? `<a href="https://vk.com/id${user_id}">${name}</a>`
    : `<a href="https://vk.com/id${user_id}">https://vk.com/id${user_id}</a>`;

  const { body } = object;
  await bot.telegram
    .sendMessage(
      chat,
      cutText(`(Сообщение) ${link}: ${body}`, CONFIG.POSTS.new_message_char_limit),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Посмотреть диалог',
                url: makeDialogUrl(group_id, user_id),
              },
            ],
          ],
        },
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }
    )
    .catch(() => false);

  await setOnlineStatus();

  return true;
};
