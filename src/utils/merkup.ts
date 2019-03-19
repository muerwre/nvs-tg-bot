import { EMOTIONS } from "../const";

export const makeKB = (
  emotions: number[],
  { post_url, is_cutted, map_url, topic_url }: { post_url?: string, is_cutted?: boolean, map_url?: string, topic_url?: string } = {},
) => ([
  [...Object.values(EMOTIONS).map((emo: string, i: number) => ({ text: `${emo}‍ ${emotions[i]}`, callback_data: `emo [${i}]`}))],
  ((topic_url) ? [{ text: 'Читать статью', url: topic_url }] : []),
  [
    ...((map_url) ? [{ text: 'Карта маршрута️', url: map_url }] : []),
    ...((post_url && !is_cutted) ? [{ text: 'Посмотреть пост', url: post_url }] : []),
    ...((post_url && is_cutted) ? [{ text: 'Пост полностью', url: post_url }] : []),
  ]
]);
