const { Extra } = require('telegraf');

export const makeKB = (omg: number, sad: number, think: number, yeah: number) => Extra.HTML().markup(m => m.inlineKeyboard([
  m.callbackButton(`😱‍ ${omg}`, `emo ${omg + 1} ${sad} ${think} ${yeah}`),
  m.callbackButton(`😒 ${sad}`, `emo ${omg} ${sad + 1} ${think} ${yeah}`),
  m.callbackButton(`🤔 ${think}`, `emo ${omg} ${sad} ${think + 1} ${yeah}`),
  m.callbackButton(`😀 ${yeah}`, `emo ${omg} ${sad} ${think} ${yeah + 1}`),
]));

