import bot from '../bot';
import * as express from 'express';
import { getMembersCount, getUserName } from "../utils/vk_api";

interface IUserObject {
  type: string,
  object: {
    user_id: number,
  },
}

export const groupJoinResponder = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  if (!chat) return;

  const { type, object: { user_id } } = req.body as IUserObject;
  const name = await getUserName(user_id);

  const count = await getMembersCount();

  const members = (count && ` _${count}_`) || ' ';
  const status = type === 'group_join' ? 'присоединился к группе 😃' : 'cвалил из группы 😡';
  // [inline URL](http://www.example.com/)
  const link = name
    ? `[${name}](https://vk.com/id${user_id})`
    : `[https://vk.com/id${user_id}](https://vk.com/id${user_id})`;
  const text = `(Участники)${members} ${link} ${status}`;

  const extras = { parse_mode: 'Markdown', disable_web_page_preview: true };

  await bot.telegram.sendMessage(chat, text, extras).catch(() => null);

  return true;
};
