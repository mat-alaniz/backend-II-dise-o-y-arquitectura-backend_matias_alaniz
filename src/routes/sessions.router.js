import { Router } from 'express';
import passport from 'passport';
import { registerUser, login, current, logout } from '../controllers/sessions.controller.js';

const router = Router();

//registro de usuario
router.post('/register', registerUser);
//login de usuario
router.post('/login', login);
//obtener usuario actual
router.get('/current', current);
//cerrar sesión
router.post('/logout', logout);

export default router;