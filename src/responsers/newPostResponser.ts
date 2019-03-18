import { CONFIG } from "$config/server";
// import telegram from "../bot/telegram";
import bot from '../bot';
import { getLargestThumb } from "../utils/vk_media";
import * as express from 'express';

interface INewPostObject {

}

export const newPostResponser = async (req: express.Request, res: express.Response) => {
  const { body: { object } } = req;
  const { text, attachments } = object;

  const textSent = await bot.telegram.sendMessage(CONFIG.TELEGRAM.chat, text)
    .then(() => true)
    .catch(() => false);

  if (attachments && attachments.length > 0) {
    const media = attachments
      .filter(att => (
        att.type === 'photo' &&
        getLargestThumb(att, CONFIG.VK.largest_image) &&
        getLargestThumb(att, CONFIG.VK.thumb_size)
      ))
      .map(att => ({
        media: { url: getLargestThumb(att, CONFIG.VK.largest_image) },
        thumb: getLargestThumb(att, CONFIG.VK.thumb_size),
        caption: att.text || '',
        type: 'photo',
      }))
      .slice(0, CONFIG.VK.max_thumbs);

    const mediaSent = await bot.telegram.sendMediaGroup(CONFIG.TELEGRAM.chat, media)
      .then(resp => true)
      .catch(err => false);
  }

  return res.send({ success: textSent });
};
