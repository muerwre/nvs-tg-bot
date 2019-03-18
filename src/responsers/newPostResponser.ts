import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";

interface INewPostObject {

}

export const newPostResponser = async (req: express.Request, res: express.Response): Promise<express.Response> => {
  const { body: { object } } = req;
  const { text, attachments } = object;

  const extras = makeKB(Object.keys(EMOTIONS).map(() => 0));

  console.log('extras', Object.keys(EMOTIONS).map(() => 0));

  const textSent = await bot.telegram.sendMessage(CONFIG.TELEGRAM.chat, text, extras)
    .then(() => true)
    .catch(err => {
      console.log('err', err);

      return false;
    });

  // if (attachments && attachments.length > 0) {
  //   const media = attachments
  //     .filter(att => (
  //       att.type === 'photo' &&
  //       getLargestThumb(att, CONFIG.VK.largest_image) &&
  //       getLargestThumb(att, CONFIG.VK.thumb_size)
  //     ))
  //     .map(att => ({
  //       media: { url: getLargestThumb(att, CONFIG.VK.largest_image) },
  //       thumb: getLargestThumb(att, CONFIG.VK.thumb_size),
  //       caption: att.text || '',
  //       type: 'photo',
  //     }))
  //     .slice(0, CONFIG.VK.max_thumbs);
  //
  //   const mediaSent = await bot.telegram.sendMediaGroup(CONFIG.TELEGRAM.chat, media)
  //     .then(resp => true)
  //     .catch(err => false);
  // }

  return res.send({ success: textSent });
};
