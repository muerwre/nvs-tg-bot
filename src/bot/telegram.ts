import { CONFIG } from '~/config/server';

const SocksProxyAgent = require('socks-proxy-agent');
const Telegram = require('telegraf/telegram');

const agent = new SocksProxyAgent(CONFIG.PROXY);
const options = {
  channelMode: true,
  telegram: { agent },
  agent,
};

const telegram = new Telegram(CONFIG.TELEGRAM.key, options);

export default telegram;

console.log('using proxy', CONFIG.PROXY);
