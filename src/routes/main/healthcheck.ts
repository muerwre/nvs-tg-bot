import bot from "../../bot";

export default (req, res) =>
  bot.telegram
    .getMe()
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(503));
