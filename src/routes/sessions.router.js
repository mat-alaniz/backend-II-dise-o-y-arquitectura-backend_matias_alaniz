import { Router } from 'express';
import { login, registerUser, current, logout } from '../controllers/sessions.controller.js';

const router = Router();


router.post('/login', login);
router.post('/register', registerUser);
router.get('/current', current);
router.post('/logout', logout);

export default router;