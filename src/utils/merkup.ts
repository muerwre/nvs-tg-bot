import { EMOTIONS } from "../const";
const { Extra } = require('telegraf');

export const makeKB = (
  emotions: number[],
  { post_url, is_cutted, map_url }: { post_url?: string, is_cutted?: boolean, map_url?: string } = {},
) => (
  Extra.HTML().markup(m => m.inlineKeyboard([
    ...Object.values(EMOTIONS).map((emo: string, i: number) => m.callbackButton(`${emo}‍ ${emotions[i]}`,`emo [${i}]`)),
    ...((map_url) ? [m.urlButton('Карта маршрута️', map_url)] : []),
    ...((post_url && is_cutted) ? [m.urlButton('Посмотреть пост️', post_url)] : []),
    ...((post_url && !is_cutted) ? [m.urlButton('Читать дальше️', post_url)] : []),
  ],
{ columns: Object.keys(EMOTIONS).length }))
);

