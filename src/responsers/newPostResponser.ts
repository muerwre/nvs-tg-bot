import { CONFIG } from "$config/server";

export const newPostResponser = (req, res) => {
  const { body: { object} } = req;

  console.log('OBJ IS', object);

  return res.send({ success: true });
};
