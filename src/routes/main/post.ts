import { CONFIG } from '../../../config/server';
import { TYPES } from "../../const";

const handler = async (req, res) => {
  const { body, body: { type, group_id, secret } } = req;

  console.log('BODY IS', body);

  if (group_id !== CONFIG.VK.group_id || secret !== CONFIG.VK.secret_key) {
    return res.status(401).send('Invalid credentials');
  }

  if (type === TYPES.CONFIRMATION) {
    return res.send(CONFIG.VK.test_response);
  }

  if(type === TYPES.NEW_POST) {
    console.log('attachments!', JSON.stringify(body.object.attachments));
  }

  return res.send({ success: true, status: 'unknown request' });
};

export default handler;
