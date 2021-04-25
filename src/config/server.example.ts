import { DEFAULTS, DEFAULT_TYPES, makeChannels } from '~/config/defaults';

export const TYPES = DEFAULT_TYPES;

export const CONFIG = {
  ...DEFAULTS, // override default settings here
};

export const CHANNELS =
  (CONFIG.TELEGRAM && CONFIG.TELEGRAM.channels && makeChannels(CONFIG.TELEGRAM.channels)) || {};

console.log('LISTENING TO CHANNELS:\n', CHANNELS);
