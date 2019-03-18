import { Router } from 'express';
import get from './main/get';
import post from './main/post';

const router = Router();
router.get('/', get);
router.post('/', post);

export default router;
