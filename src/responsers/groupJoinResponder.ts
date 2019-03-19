import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { makeKB } from "../utils/merkup";
import { EMOTIONS, OK_RESPONSE } from "../const";
import { cutText, getAttachmentLinks, getMapUrl, makePostUrl, parseAttachments } from "../utils/vk_media";
import { Post } from "../models/Post";

interface IUserObject {
  type: string,
  object: {
    user_id: number,
  },
}

export const groupJoinResponder = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  console.log(req.body.type, chat);
  if (!chat) return;

  const { type, object: { user_id } } = req.body as IUserObject;
  const text = `https://vk.com/id${user_id} ${type === 'group_join' ? 'присоединился к группе' : 'Свалил из группы'}`;
  await bot.telegram.sendMessage(
    chat,
    text,
    // { parse_mode: 'Markup' }
  ).catch(console.log);

  return true;
};
