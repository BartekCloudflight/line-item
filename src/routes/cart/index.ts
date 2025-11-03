import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { getCartRequest } from './cart';

const router = Router();

router.get('/cart', authenticateToken, getCartRequest);

export default router;
