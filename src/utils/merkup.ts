import { EMOTIONS } from "../const";

const { Extra } = require('telegraf');

export const makeKB = (emotions: number[]) => Extra.HTML().markup(m => m.inlineKeyboard(Object.values(EMOTIONS).map((emo: string, i: number) => (
  m.callbackButton(
    `${emo}‍ ${emotions[i]}`,
    `emo ${emotions.map((em2, i2) => (i2 === i ? (em2 || 0) + 1 : (em2 || 0))).join(' ')}`
  )
))));

// m.callbackButton(`😱‍ ${omg}`, `emo ${omg + 1} ${sad} ${think} ${yeah}`),
