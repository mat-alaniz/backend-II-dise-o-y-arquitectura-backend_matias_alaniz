import { Router } from 'express';
import passport from 'passport';
import { registerUser, login, current, logout } from '../controllers/sessions.controller.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

//registro de usuario
router.post('/register', registerUser);
//login de usuario
router.post('/login', login);
//obtener usuario actual
router.get('/current', current);
//cerrar sesión
router.post('/logout', logout);
//verificar rol admin
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), isAdmin, (req, res) => {
    res.status(200).json({ status: 'success', message: 'Acceso permitido, bienvenido al panel de administración' });
});

export default router;