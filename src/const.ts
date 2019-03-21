import { confirmationResponser } from "./responsers/confirmationResponser";
import { defaultResponser } from "./responsers/defaultResponser";
import { newPostResponser } from "./responsers/newPostResponser";
import { TYPES } from "$config/server";
import * as express from 'express';
import { groupJoinResponder } from "./responsers/groupJoinResponder";
import { postSuggestionResponser } from "./responsers/postSuggestionResponser";
import { messageNewResponser } from "./responsers/messageNewResponser";

// export const TYPES = {
//   CONFIRMATION: 'confirmation',
//   NEW_POST: 'wall_post_new',
// };

interface IResponsers {
  [x: string]: (req: express.Request, res: express.Response, chat?: string) => Promise<any>,
}

export const RESPONSERS: IResponsers = {
  [TYPES.CONFIRMATION]: confirmationResponser,
  [TYPES.NEW_POST]: newPostResponser,
  [TYPES.GROUP_JOIN]: groupJoinResponder,
  [TYPES.GROUP_LEAVE]: groupJoinResponder,
  [TYPES.POST_SUGGESTION]: postSuggestionResponser,
  [TYPES.MESSAGE_NEW]: messageNewResponser,
  DEFAULT: defaultResponser,
};

export const EMOTIONS = {
  omg: '😱',
  hmm: '🤔',
  wow: '😃',
};

export const GROUPS = {
  46909317: 'upferr',
  124752609: 'pogonia_nsk',
};

export const OK_RESPONSE = 'ok';
