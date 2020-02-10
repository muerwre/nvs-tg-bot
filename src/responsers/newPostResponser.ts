import { CONFIG } from "$config/server";
import bot from "../bot";
import * as express from "express";
import { makeKB } from "../utils/merkup";
import { EMOTIONS, OK_RESPONSE } from "../const";
import {
  cutText,
  getAlbumUrl,
  getAttachmentLinks,
  getMapUrl,
  makePostUrl,
  parseAttachments,
  parseText
} from "../utils/vk_media";
import { Post } from "../entity/Post";
import { getUserName } from "../utils/vk_api";

export interface IAttachment {
  type: string;
  photo?: {
    id: number;
    album_id: number;
    owner_id: number;
    user_id: number;
    photo_75?: string;
    photo_130?: string;
    photo_604?: string;
    photo_807?: string;
    photo_1280?: string;
    photo_2560?: string;
    width: number;
    height: number;
    text: string;
    date: number;
    access_key: string;
  };
  link?: {
    url: string;
    title: string;
    caption: string;
    description: string;
    is_external: number;
    photo: {
      id: number;
      album_id: number;
      owner_id: number;
      user_id: number;
      photo_75: string;
      photo_130: string;
      photo_604: string;
      photo_807: string;
      photo_1280: string;
      photo_2560: string;
      width: number;
      height: number;
      text: string;
      date: number;
    };
    button: {
      title: string;
      url: string;
    };
  };
}

export interface INewPostObject {
  type: string;
  object: {
    id: number;
    from_id: number;
    owner_id: number;
    signer_id: number;
    date: number;
    marked_as_ads: number;
    post_type: string;
    text: string;
    can_edit: number;
    created_by: number;
    can_delete: number;
    comments: {
      count: number;
    };
    attachments: IAttachment[];
  };
  group_id: number;
  secret: string;
}

export const newPostResponser = async (
  req: express.Request & { body: INewPostObject },
  res: express.Response,
  chat?: string
): Promise<boolean> => {
  if (!chat) return;

  const { object, group_id } = req.body;
  const { text, attachments, signer_id } = object;

  const parsed = parseText(text);
  const images =
    attachments &&
    parseAttachments(attachments).slice(0, CONFIG.POSTS.max_thumbs);
  const topics = attachments && getAttachmentLinks(attachments).slice(0, 1);
  const is_image_post =
    CONFIG.POSTS.attach_images && images && images.length > 0;

  const exist = await Post.findOne({
    chat,
    group_id: group_id,
    post_id: object.id
  });

  if (exist) {
    console.log(`[POST] ${object.id} already in db`);
    return;
  }

  const text_limit = is_image_post
    ? CONFIG.POSTS.char_limit_image
    : CONFIG.POSTS.char_limit_text;
  const is_cutted = parsed.length > text_limit;
  const topic_url = (topics && topics[0] && topics[0].url) || null;

  const name = signer_id && signer_id > 0 && (await getUserName(signer_id));
  const link =
    (name && `\n\n- <a href="https://vk.com/id${signer_id}">${name}</a>\n`) ||
    `\n`;

  const extras = {
    reply_markup: {
      inline_keyboard: makeKB(
        Object.keys(EMOTIONS).map(() => 0),
        {
          post_url: makePostUrl(group_id, object.id),
          map_url: getMapUrl(text),
          album_url: getAlbumUrl(text),
          topic_url,
          is_cutted
        }
      )
    },
    parse_mode: "HTML",
    disable_web_page_preview: true
  };

  const message = is_image_post
    ? await bot.telegram
        .sendPhoto(chat, images[0].media, {
          caption: `${cutText(parsed, text_limit)}${link}`,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          ...extras
        })
        .catch(error => {
          console.log(`[POST] ${object.id} catched error`);
          console.log(error);
        })
    : await bot.telegram
        .sendMessage(chat, `${cutText(parsed, text_limit)}${link}`, extras)
        .catch(error => {
          console.log(`[POST] ${object.id} catched error`);
          console.log(error);
        });

  if (message) {
    console.log(
      `[POST] ${object.id} sent as ${is_image_post ? "image" : "plain text"}`
    );

    await Post.create({
      chat: `@${message.chat.username}`,
      chat_id: message.chat.id,
      message_id: message.message_id,
      group_id: group_id,
      post_id: object.id,
      is_cutted,
      post_url: makePostUrl(group_id, object.id),
      map_url: getMapUrl(text),
      album_url: getAlbumUrl(text),
      topic_url
    }).save();

    return;
  } else {
    return;
  }
};
