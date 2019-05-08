export const DEFAULT_TYPES = {
  CONFIRMATION: 'confirmation',
  NEW_POST: 'wall_post_new',
  POST_SUGGESTION: 'post_suggestion', // will not detect it
  GROUP_JOIN: 'group_join',
  GROUP_LEAVE: 'group_leave',
  MESSAGE_NEW: 'message_new',
};

export const DEFAULTS = {
  HTTP: {
    ENABLED: true,
    PORT: 3002, // port to listen on
  },
  VK: {
    group_id: 0,
    test_response: '',
    secret_key: '',
    api_key: '',
  },
  POSTS: {
    largest_image: 1280,
    thumb_size: 130,
    max_thumbs: 3,
    char_limit_text: 1000,
    char_limit_image: 960,
    attach_images: true,
    new_message_delay: 60 * 60 * 1000, // time from latest message sent (one hour)
    new_message_char_limit: 200,
  },
  TELEGRAM: {
    key: '', // take it from BotFather
    channels: [
      // {
      //   chat: '@chan_id', // can be @chan_id ir -123456789 for private chans
      //   events: [TYPES.NEW_POST, TYPES.GROUP_JOIN],
      // },
    ]
  },
  PROXY: '', // socks proxy, can be empty
  DB: { // will be used to store likes data
    NEEDS_AUTH: false,
    USER: '',
    PASSWORD: '',
    HOSTNAME: 'localhost',
    PORT: 27017,
    DATABASE: 'tg-bot',
  },
};

export const makeChannels = (channels) => channels.reduce((obj, chan) => ({
  ...obj,
  ...chan.events.reduce((obj2, event) => ({
    ...obj2,
    [event]: [ ...(obj[event] || []), chan.chat ]
  }), {})
}), {});
