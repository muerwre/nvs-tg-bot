import { CONFIG } from "$config/server";
import axios from 'axios';

export const getUserName = async (user_id: number): Promise<string> => {
  if (!CONFIG.VK.api_key) return '';

  const fields = await axios.get(
    `https://api.vk.com/method/users.get`,
    {
      params: {
        user_ids: user_id,
        fields: '',
        access_token: CONFIG.VK.api_key,
        v: '5.92',
      }
    }
  )
    .then(response => (response.data && response.data.response) || [{}])
    .catch(() => [{}]);

  const { first_name = '', last_name = '' } = (fields && fields[0]) || {};

  return `${first_name} ${last_name}`;
};

export const getMembersCount = async (): Promise<number> => {
  if (!CONFIG.VK.api_key) return 0;

  const fields = await axios.get(
    `https://api.vk.com/method/groups.getMembers`,
    {
      params: {
        group_id: CONFIG.VK.group_id,
        fields: '',
        offset: 0,
        access_token: CONFIG.VK.api_key,
        v: '5.92',
      }
    }
  )
    .then(response => (response.data && response.data && response.data.response) || {})
    .catch(() => {});

  const { count } = fields;

  return count;
};
