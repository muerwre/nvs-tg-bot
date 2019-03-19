import { CHANNELS, CONFIG, TYPES } from '$config/server';
import { OK_RESPONSE, RESPONSERS } from "../../const";

import * as express from 'express';

const handler = async (req: express.Request, res: express.Response): Promise<express.Response> => {
  const { body: { type, group_id, secret } } = req;

  if (group_id !== CONFIG.VK.group_id || (type !== TYPES.CONFIRMATION && secret !== CONFIG.VK.secret_key)) {
    return res.status(401).send('Invalid credentials');
  }

  if (type === TYPES.CONFIRMATION) {
    return RESPONSERS[type](req, res);
  } else {
    if (CHANNELS[type]) {
      console.log('working with', type, CHANNELS[type]);

      await Promise.all(
        CHANNELS[type].map(chan => (
          (RESPONSERS[type] && RESPONSERS[type](req, res, chan)) || RESPONSERS.DEFAULT(req, res)
        ))
      );
    }
  }

  // return (RESPONSERS[type] && RESPONSERS[type](req, res)) || RESPONSERS.DEFAULT(req, res);



  return res.send(OK_RESPONSE);
};

export default handler;
