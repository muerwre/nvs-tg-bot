import { Router } from 'express';
import get from './main/get';

const router = Router();
router.get('/', get);

export default router;
