import { Router } from 'express';
import get from './main/get';
import post from './main/post';
import healthcheck from './main/healthcheck';

const router = Router();

router.get('/', get);
router.post('/', post);
router.get('/healthcheck', healthcheck);

export default router;
