// src/utils.js
import passport from 'passport';

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // Manejo seguro de mensajes de error
        let errorMessage = "No autorizado";
        
        if (info) {
          if (typeof info === 'string') {
            errorMessage = info;
          } else if (info.message) {
            errorMessage = info.message;
          } else if (info.messages) {
            errorMessage = info.messages;
          }
        }
        
        return res.status(401).json({ 
          status: "error", 
          message: errorMessage 
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};