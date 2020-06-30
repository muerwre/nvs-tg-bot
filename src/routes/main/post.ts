import { CHANNELS, CONFIG, TYPES } from "$config/server";
import { OK_RESPONSE, RESPONSERS } from "../../const";

import * as express from "express";

const handler = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  try {
    const {
      body: { type, group_id, secret, object },
    } = req;

    if (
      group_id !== CONFIG.VK.group_id ||
      (type !== TYPES.CONFIRMATION && secret !== CONFIG.VK.secret_key)
    ) {
      return res.status(401).send("Invalid credentials");
    }

    if (type === TYPES.CONFIRMATION) {
      return RESPONSERS[type](req, res);
    } else if (
      type === TYPES.NEW_POST &&
      object &&
      object.post_type === "suggest"
    ) {
      res.send(OK_RESPONSE);

      // intercept post suggestions
      if (
        CHANNELS[TYPES.POST_SUGGESTION] &&
        RESPONSERS[TYPES.POST_SUGGESTION]
      ) {
        await Promise.all(
          CHANNELS[TYPES.POST_SUGGESTION].map((chan) =>
            RESPONSERS[TYPES.POST_SUGGESTION](req, res, chan)
          )
        );
      }
    } else {
      res.send(OK_RESPONSE);
      
      if (CHANNELS[type]) {
        await Promise.all(
          CHANNELS[type].map(
            (chan) =>
              (RESPONSERS[type] && RESPONSERS[type](req, res, chan)) ||
              RESPONSERS.DEFAULT(req, res)
          )
        );
      }
    }

    return;
  } catch (e) {
    console.log(e);
  }
};

export default handler;
