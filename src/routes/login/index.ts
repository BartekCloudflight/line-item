import { Router } from 'express';
import { loginPostRequest } from './login';

const router = Router();

router.post('/login', loginPostRequest);

export default router;
