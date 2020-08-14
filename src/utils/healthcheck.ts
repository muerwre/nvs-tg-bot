import { getConnection } from 'typeorm';
import bot from '~/bot';

export const checkHealth = () =>
  Promise.all([bot.telegram.getMe(), getConnection().query('SELECT 1')]);
