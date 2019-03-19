import { IAttachment } from "../responsers/newPostResponser";
import { CONFIG } from "$config/server";
import { GROUPS } from "../const";

const sizes = [2560, 1280, 807, 604,130, 75];

export const getLargestThumb = (att: IAttachment, max_size: number = 807) => {
  const candidate = sizes.find(size => size <= max_size && att.photo[`photo_${size}`]);

  return (candidate && att.photo[`photo_${candidate}`] || '');
};

export const parseAttachments = (attachments: IAttachment[] = []) => attachments
  .filter(att => (
    att.type === 'photo' &&
    getLargestThumb(att, CONFIG.POSTS.largest_image) &&
    getLargestThumb(att, CONFIG.POSTS.thumb_size)
  ))
  .map(att => ({
    media: getLargestThumb(att, CONFIG.POSTS.largest_image),
    thumb: getLargestThumb(att, CONFIG.POSTS.thumb_size),
    caption: att.photo.text || '',
    type: 'photo',
  }));

export const getAttachmentLinks = (attachments: IAttachment[] = []) => attachments
  .filter(att => (
    att.type === 'link' &&
    att.link &&
    att.link.button &&
    att.link.button.title === 'Читать'
  ))
  .map(att => ({
    title: att.link.title,
    url: att.link.url,
  }));

export const makePostUrl = (group_id: number, post_id: number): string => GROUPS[group_id]
  ? `https://vk.com/${GROUPS[group_id]}?w=wall-${group_id}_${post_id}`
  : `https://vk.com/wall-${group_id}_${post_id}`;

export const getMapUrl = (text: string): string => {
  const match = text && text.match(/(http|https):\/\/(map|alpha-map)\.vault48\.org\/[A-Za-z\_]+/);

  return (match && match[0]) || '';
};

export const cutText = (text: string, limit: number): string => `${text.substr(0, limit)}${text.length > limit ? '...' : ''}`;
