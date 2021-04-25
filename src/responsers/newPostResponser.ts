import * as express from 'express';
import { CONFIG } from '~/config/server';
import bot from '../bot';
import {
  cutText,
  getAlbumUrl,
  getAttachmentLinks,
  getMapUrl,
  makePostUrl,
  parseAttachments,
  parseText,
} from '~/utils/vk_media';
import { Post } from '~/entity/Post';
import { getUserName } from '~/utils/vk_api';
import { INewPostObject } from '~/types/vk';
import { postErrorCatcher } from '~/utils/catch';
import { makeExtras } from '~/utils/extras';

export const newPostResponser = async (
  req: express.Request & { body: INewPostObject },
  res: express.Response,
  chat?: string
): Promise<boolean> => {
  if (!chat) return;

  const { object, group_id }: INewPostObject = req.body;
  const { text, attachments, signer_id } = object;

  const exist = await Post.findOne({
    chat,
    group_id,
    post_id: object.id,
  });

  if (exist) {
    console.log(`[POST] ${object.id} already in db`);
    return;
  }

  const parsed = parseText(text);
  const images = parseAttachments(attachments)?.slice(0, CONFIG.POSTS.max_thumbs);
  const topics = attachments && getAttachmentLinks(attachments).slice(0, 1);
  const is_image_post = CONFIG.POSTS.attach_images && images && images.length > 0;

  const text_limit = is_image_post ? CONFIG.POSTS.char_limit_image : CONFIG.POSTS.char_limit_text;
  const is_cutted = parsed.length > text_limit;
  const topic_url = (topics && topics[0] && topics[0].url) || null;

  const name = signer_id && signer_id > 0 && (await getUserName(signer_id));
  const link = (name && `\n\n- <a href="https://vk.com/id${signer_id}">${name}</a>\n`) || `\n`;

  const extras = makeExtras(group_id, object.id, text, topic_url, is_cutted);

  const message = is_image_post
    ? await bot.telegram
        .sendPhoto(chat, images[0].media, {
          caption: `${cutText(parsed, text_limit)}${link}`,
          parse_mode: 'HTML',
          disable_web_page_preview: null,
          ...extras,
        })
        .catch(postErrorCatcher(object))
    : await bot.telegram
        .sendMessage(chat, `${cutText(parsed, text_limit)}${link}`, extras)
        .catch(postErrorCatcher(object));

  if (message) {
    console.log(`[POST] ${object.id} sent as ${is_image_post ? 'image' : 'plain text'}`);

    await Post.create({
      chat: `@${message.chat.username}`,
      chat_id: message.chat.id,
      message_id: message.message_id,
      group_id,
      post_id: object.id,
      is_cutted,
      post_url: makePostUrl(group_id, object.id),
      map_url: getMapUrl(text),
      album_url: getAlbumUrl(text),
      topic_url,
    }).save();
  }
};
