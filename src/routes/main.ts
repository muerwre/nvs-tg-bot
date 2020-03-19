import { Router } from 'express';
import get from './main/get';
import post from './main/post';
import ping from './main/ping';

const router = Router();

router.get('/', get);
router.post('/', post);
router.post('/ping', ping);

export default router;
