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
  const text = `https://vk.com/id${user_id} ${type === 'group_join' ? 'присоединился к группе' : 'Свалил из группы'}`;
  await bot.telegram.sendMessage(chat, text).catch(() => null);

  return true;
};
