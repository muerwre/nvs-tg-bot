import { DEFAULTS, DEFAULT_TYPES, makeChannels } from "$config/defaults";

export const TYPES = DEFAULT_TYPES;

const pogonia_group = {
  group_id: 124752609,
  test_response: '0a6e3882',
  secret_key: 'imalittlemonkeyja1337825',
  api_key: '59a84a8b341b277c77d33402ef51ca1944d2083da084d1b7e521a5ebf508b067019e24e524f7da0aab34f',
};

const upferr_group = {
  group_id: 46909317,
  test_response: 'c931b0a3',
  secret_key: 'imalittlemonkeyja1337825',
  api_key: 'e048e83950d5e8ef1067d3cce40c87931f930eea6273213622b97f490ff6d64cfa4d67205525c3adabf05',
};

const pogonia_chan = {
  chat: '@pogonia_nsk', // should be pogonia_nsk
  events: [TYPES.NEW_POST],
};

const log_chan = {
  chat: '@pogonia_log_chan', // should be pogonia_log_chan
  events: [TYPES.GROUP_LEAVE, TYPES.GROUP_JOIN, TYPES.POST_SUGGESTION, TYPES.MESSAGE_NEW],
};

const test_chan = {
  chat: '@pogonia_test_chan', // should be pogonia_log_chan
  events: [TYPES.NEW_POST, TYPES.GROUP_LEAVE, TYPES.GROUP_JOIN, TYPES.POST_SUGGESTION, TYPES.MESSAGE_NEW],
};

const pogonia_bot = '517602362:AAFHFZOXyqP12Fgm4rYTdi-jjlkx1H4Upa8'; // actually pogoniabot
const test_bot = '822614943:AAHQ_CyxDNUL0-UBBQUILt-qqzcszh5u114';

export const CONFIG = {
  ...DEFAULTS,
  HTTP: {
    ...DEFAULTS.HTTP,
    PORT: 13002,
  },
  VK: {
    ...DEFAULTS.VK,
    // ...pogonia_group,
    ...upferr_group,
  },
  TELEGRAM: {
    ...DEFAULTS.TELEGRAM,
    key: test_bot,
    channels: [
      // pogonia_chan,
      // log_chan
      test_chan,
    ]
  },
  DB: {
    ...DEFAULTS.DB,
    NEEDS_AUTH: false,
    // USER: 'derek',
    // PASSWORD: 'puzzword87852',
    // HOSTNAME: 'localhost',
    // PORT: 27017,
    DATABASE: 'tg-bot',
  },
};

export const CHANNELS = (CONFIG.TELEGRAM && CONFIG.TELEGRAM.channels && makeChannels(CONFIG.TELEGRAM.channels)) || {};

console.log("LISTENING TO CHANNELS:\n", CHANNELS);
