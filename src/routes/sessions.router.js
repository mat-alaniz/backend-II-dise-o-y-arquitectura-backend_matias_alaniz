import { Router } from 'express';
import passport from 'passport';
import { issueToken, current, logout } from '../controllers/sessions.controller.js';

const router = Router();


router.post('/register', 
  passport.authenticate('register', { failureRedirect: '/register?error=1', session: false }),
  (req, res) => {
    res.status(201).json({ status: 'success', message: 'Usuario registrado con éxito', user: req.user });
  }
);

router.post('/login', 
  passport.authenticate('login', { failureRedirect: '/login?error=1', session: false }),
  issueToken 
);

router.get('/current', 
    passport.authenticate('jwt', { session: false }),
    current
);

router.post('/logout', 
    passport.authenticate('jwt', { session: false }),
    logout
);

export default router;