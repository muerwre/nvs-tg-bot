import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { makeKB } from "../utils/merkup";
import { cutText,  makePostUrl, parseAttachments } from "../utils/vk_media";
import { INewPostObject } from "./newPostResponser";



export const postSuggestionResponser = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  console.log('suggestiuon data to', { chat });
  if (!chat) return;

  const { object, group_id } = req.body as INewPostObject;
  const { text, attachments } = object;

  const images = attachments && parseAttachments(attachments).slice(0, CONFIG.POSTS.max_thumbs);
  const is_image_post = CONFIG.POSTS.attach_images && images && images.length > 0;

  const text_limit = is_image_post ? CONFIG.POSTS.char_limit_image : CONFIG.POSTS.char_limit_text;

  await bot.telegram.sendMessage(
    chat,
    cutText(`*Новый пост в предложке:*\n\n${text}`, text_limit),
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Посмотреть предложенный пост', url: makePostUrl(group_id, object.id) }
        ]],
      },
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    },
  ).catch(() => false);

  return true;
};
