import { CONFIG } from '$config/server';
import { RESPONSERS, TYPES } from "../../const";
import { confirmationResponser } from "../../responsers/confirmationResponser";

const handler = async (req, res) => {
  const { body, body: { type, group_id, secret } } = req;

  if (group_id !== CONFIG.VK.group_id || secret !== CONFIG.VK.secret_key) {
    return res.status(401).send('Invalid credentials');
  }

  return (RESPONSERS[type] && RESPONSERS[type](req, res)) || RESPONSERS.DEFAULT(req, res);
};

export default handler;
