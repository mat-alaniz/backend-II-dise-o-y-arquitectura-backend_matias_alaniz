import { Router } from 'express';
import { registerUser, login, current } from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/current', current);

export default router;