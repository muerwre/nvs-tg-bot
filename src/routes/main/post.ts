import { CONFIG } from '../../../config/server';

const handler = async (req, res) => {
  const { body: { type, group_id, secret } } = req;

  if (group_id !== CONFIG.VK.group_id || secret !== CONFIG.VK.secret_key) {
    return res.status(401).send('Invalid credentials');
  }

  if (type && type ==='confirmation') {
    return res.send(CONFIG.VK.test_response);
  }

  return res.status(404).send('Invalid credentials');
};

export default handler;
