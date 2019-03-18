import { CONFIG } from '$config/server';
import { RESPONSERS } from "../../const";
import * as express from 'express';

const handler = async (req: express.Request, res: express.Response): Promise<express.Response> => {
  const { body: { type, group_id, secret } } = req;

  if (group_id !== CONFIG.VK.group_id || secret !== CONFIG.VK.secret_key) {
    return res.status(401).send('Invalid credentials');
  }

  return (RESPONSERS[type] && RESPONSERS[type](req, res)) || RESPONSERS.DEFAULT(req, res);
};

export default handler;
