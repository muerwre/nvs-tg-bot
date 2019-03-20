import { CONFIG } from "$config/server";
import bot from '../bot';
import * as express from 'express';
import { makeKB } from "../utils/merkup";
import { EMOTIONS, OK_RESPONSE } from "../const";
import { cutText, getAttachmentLinks, getMapUrl, makePostUrl, parseAttachments } from "../utils/vk_media";
import { Post } from "../models/Post";

export interface IAttachment {
  type: string,
  photo?: {
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
  },
  link?: {
    url: string,
    title: string,
    caption: string,
    description: string,
    is_external: number,
    photo: {
      id: number,
      album_id: number,
      owner_id: number,
      user_id: number,
      photo_75: string,
      photo_130: string,
      photo_604: string,
      photo_807: string,
      photo_1280: string,
      photo_2560: string,
      width: number,
      height: number,
      text: string,
      date: number,
    },
    button: {
      title: string,
      url: string,
    }
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

export const newPostResponser = async (req: express.Request, res: express.Response, chat?: string): Promise<boolean> => {
  if (!chat) return;

  console.log(JSON.stringify(req.body));

  const { object, group_id } = req.body as INewPostObject;
  const { text, attachments } = object;

  const images = attachments && parseAttachments(attachments).slice(0, CONFIG.POSTS.max_thumbs);
  const topics = attachments && getAttachmentLinks(attachments).slice(0, 1);
  const is_image_post = CONFIG.POSTS.attach_images && images && images.length > 0;

  const exist = await Post.findOne({ chat, group_id: group_id, post_id: object.id });

  // if (exist) return;

  const text_limit = is_image_post ? CONFIG.POSTS.char_limit_image : CONFIG.POSTS.char_limit_text;
  const is_cutted = (text.length > text_limit);
  const topic_url = (topics && topics[0] && topics[0].url) || null;

  const extras = {
    reply_markup: {
      inline_keyboard: makeKB(
        Object.keys(EMOTIONS).map(() => 0),
        {
          post_url: makePostUrl(group_id, object.id),
          map_url: getMapUrl(text),
          topic_url,
          is_cutted,
        }
      ),
    },
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  };

  console.log({ is_image_post, images });

  const message = is_image_post
    ?
      await bot.telegram.sendPhoto(
        chat,
        images[0].media,
        {
          caption: cutText(text, text_limit),
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          ...extras,
        }
      )
    :
      await bot.telegram.sendMessage(
        chat,
        cutText(text, text_limit),
        extras,
      ).catch(() => false);

  if (message) {
    await Post.create({
      chat: `@${message.chat.username}`,
      chat_id: message.chat.id,
      message_id: message.message_id,
      group_id: group_id,
      post_id: object.id,
      is_cutted,
      post_url: makePostUrl(group_id, object.id),
      map_url: getMapUrl(text),
      topic_url,
    });

    return;
  } else {
    return;
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
