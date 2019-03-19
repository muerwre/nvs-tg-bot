import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { makeKB } from "../utils/merkup";
import { EMOTIONS } from "../const";
import { cutText, getMapUrl, makePostUrl, parseAttachments } from "../utils/vk_media";
import { Post } from "../models/Post";

export interface IAttachment {
  type: string,
  photo: {
    id: number,
    album_id: number,
    owner_id: number,
    user_id: number,
    photo_75?: string,
    photo_130?: string,
    photo_604?: string,
    photo_807?: string,
    photo_1280?: string,
    photo_2560?: string,
    width: number,
    height: number,
    text: string,
    date: number,
    access_key: string,
  }
}

export interface INewPostObject {
  type: string,
  object: {
    id: number,
    from_id: number,
    owner_id: number,
    date: number,
    marked_as_ads: number,
    post_type: string,
    text: string,
    can_edit: number,
    created_by: number,
    can_delete: number,
    comments: {
      count: number,
    },
    attachments: IAttachment[],
  },
  group_id: number,
  secret: string,
}

export const newPostResponser = async (req: express.Request, res: express.Response): Promise<express.Response> => {
  const { object, group_id } = req.body as INewPostObject;
  const { text, attachments } = object;

  const images = attachments && parseAttachments(attachments).slice(0, CONFIG.POSTS.max_thumbs);

  // if (CONFIG.POSTS.attach_images && images && images.length) {
  //   await bot.telegram.sendMediaGroup(CONFIG.TELEGRAM.chat, images, { disable_notification: true })
  //     .then(() => true)
  //     .catch(() => false);
  // }

  const is_cutted = (text.length > CONFIG.POSTS.char_limit);

  const extras = {
    reply_markup: {
      inline_keyboard: makeKB(
        Object.keys(EMOTIONS).map(() => 0),
        {
          post_url: makePostUrl(group_id, object.id),
          map_url: getMapUrl(text),
          is_cutted,
        }
      ),
    },
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  };

  const message = CONFIG.POSTS.attach_images && images && images.length > 0
    ?
      await bot.telegram.sendPhoto(
        CONFIG.TELEGRAM.chat,
        images[0].media,
        {
          caption: cutText(text),
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          ...extras,
        }
      )
    :
      await bot.telegram.sendMessage(
        CONFIG.TELEGRAM.chat,
        cutText(text),
        extras,
      ).catch(() => false);

  console.log('is cutted?', is_cutted, text.length, CONFIG.POSTS.char_limit);

  if (message) {
    await Post.create({
      chat_id: message.chat.id,
      message_id: message.message_id,
      group_id: group_id,
      post_id: object.id,
      is_cutted,
      post_url: makePostUrl(group_id, object.id),
      map_url: getMapUrl(text),
    });

    console.log({ message });

    return res.send({ success: true });
  } else {
    return res.send({ success: false });
  }


  // const textSent = await bot.telegram.sendPhoto(
  //   CONFIG.TELEGRAM.chat,
  //   images[0].media,
  //   {
  //     caption: text.substr(0, CONFIG.POSTS.char_limit),
  //   }
  // );


  // if (images) {
  //   await bot.telegram.sendMediaGroup(CONFIG.TELEGRAM.chat, images, { disable_notification: true })
  //     .then(() => true)
  //     .catch(() => false);
  // }

  // if (images) {
  //   bot.telegram.sendMessage(CONFIG.TELEGRAM.chat, '*_*', {
  //     ...extras,
  //     disable_notification: true,
  //     parse_mode: 'Markdown',
  //     disable_web_page_preview: true,
  //   })
  //     .then(() => true)
  //     .catch(() => false);
  // }
};
