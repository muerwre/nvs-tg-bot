import { checkHealth } from '~/utils/healthcheck';

export default (req, res) =>
  checkHealth().then(
    () => res.sendStatus(200),
    () => res.sendStatus(503)
  );
