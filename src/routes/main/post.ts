const handler = async (req, res) => {
  const { body, body: { type, group_id, secret } } = req;
  console.log('[POST] REQ IS', { type, group_id, secret });

  return res.send({
    success: true,
    // req,
  });
};

export default handler;
