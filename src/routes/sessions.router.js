import { Router } from 'express';
import passport from 'passport';
import { register, login, current, logout } from '../controllers/sessions.controller.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = Router();

//registro de usuario
router.post('/register', register);
//login de usuario
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { 
        httpOnly: true,
        sameSite: 'lax',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
     });
    res.status(200).json({ message: 'Login exitoso', user: req.user });
});
//obtener usuario actual
router.get('/current', current);
//cerrar sesión
router.post('/logout', logout);
//verificar rol admin
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), isAdmin, (req, res) => {
    res.status(200).json({ status: 'success', message: 'Acceso permitido, bienvenido al panel de administración' });
});


router.get('/current-view', (req, res) => { res.render('current'); });

export default router;