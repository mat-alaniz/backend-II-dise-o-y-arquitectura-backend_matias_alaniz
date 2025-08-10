import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { JWT_SECRET } from './config.js';
import { isTokenBlacklisted } from '../utils/tokenBlacklist.js';

// Estrategia Local (login)
passport.use('login', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return done(null, false, { message: 'Contraseña incorrecta' });


      const userSafe = user.toObject();
      delete userSafe.password;
      return done(null, userSafe);

    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    passReqToCallback: true
  },
  async (req, jwtPayload, done) => {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) return done(null, false, { message: 'Token inválido (sesión cerrada)' });+ç
      
      const user = await User.findById(jwtPayload.id).select('-password');
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;
