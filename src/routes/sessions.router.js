import { Router } from 'express';
import passport from 'passport';
import { issueToken, current, logout } from '../controllers/sessions.controller.js';
import { requestPasswordReset, resetPassword, validateToken } from '../controllers/auth.controller.js';

const router = Router();


router.post('/register', 
  passport.authenticate('register', { failureMessage: true, session: false }),
  (req, res) => {
    res.status(201).json({ status: 'success', message: 'Usuario registrado con éxito',
      user: { id: req.user.id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name }
    });
  }
);

router.post('/login', 
  passport.authenticate('login', { failureMessage: true, session: false }),
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

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.get('/validate-token/:token', validateToken);



export default router;