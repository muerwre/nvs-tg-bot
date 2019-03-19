import { confirmationResponser } from "./responsers/confirmationResponser";
import { defaultResponser } from "./responsers/defaultResponser";
import { newPostResponser } from "./responsers/newPostResponser";

export const TYPES = {
  CONFIRMATION: 'confirmation',
  NEW_POST: 'wall_post_new',
};

export const RESPONSERS = {
  [TYPES.CONFIRMATION]: confirmationResponser,
  [TYPES.NEW_POST]: newPostResponser,

  DEFAULT: defaultResponser,
};

export const EMOTIONS = {
  omg: '😱',
  hmm: '🤔',
  wow: '😃',
};

export const GROUPS = {
  46909317: 'upferr',
};
