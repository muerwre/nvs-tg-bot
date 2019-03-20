import bot from '../bot';
import * as express from 'express';

interface IUserObject {
  type: string,
  object: {
    user_id: number,
  },
}

export const groupJoinResponder = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  if (!chat) return;

  const { type, object: { user_id } } = req.body as IUserObject;
  const text = `https://vk.com/id${user_id} ${type === 'group_join' ? 'присоединился к группе 😃' : 'cвалил из группы 😡'}`;
  const extras = { parse_mode: 'Markdown', disable_web_page_preview: true };
  await bot.telegram.sendMessage(chat, text, extras).catch(() => null);

  return true;
};
