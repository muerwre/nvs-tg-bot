import { makeKB } from '~/utils/merkup';
import { EMOTIONS } from '~/const';
import { getAlbumUrl, getMapUrl, makePostUrl } from '~/utils/vk_media';

export const makeExtras = (
  group_id: number,
  post_id: number,
  text: string,
  topic_url: string,
  is_cutted: boolean
) => ({
  reply_markup: {
    inline_keyboard: makeKB(
      Object.keys(EMOTIONS).map(() => 0),
      {
        post_url: makePostUrl(group_id, post_id),
        map_url: getMapUrl(text),
        album_url: getAlbumUrl(text),
        topic_url,
        is_cutted,
      }
    ),
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
});
