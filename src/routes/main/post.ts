const handler = async (req, res) => {
  // const { query: { name } } = req;
  console.log('[POST] REQ IS', req);

  return res.send({
    success: true,
    // req,
  });
};

export default handler;
