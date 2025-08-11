import { Router } from 'express';
import passport from 'passport';
import { registerUser, login, current, logout } from '../controllers/sessions.controller.js';

const router = Router();

// Registro de usuario
router.post('/register', registerUser);

// Login de usuario (usa estrategia local)
router.post('/login', passport.authenticate('local', { session: false }), login);

// Obtener usuario actual (protegido con JWT)
router.get('/current', passport.authenticate('jwt', { session: false }), current);

// Logout
router.post('/logout', logout);

export default router;