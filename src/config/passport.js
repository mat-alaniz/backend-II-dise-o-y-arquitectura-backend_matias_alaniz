import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import cartRepository from '../repositories/cart.repository.js';

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.jwt || null;
  }
  return null;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor
  ]),
  secretOrKey: process.env.JWT_SECRET
};

// Estrategia JWT
passport.use(new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Estrategia para registro
passport.use('register', new LocalStrategy(
  { 
    usernameField: 'email', passwordField: 'password',  passReqToCallback: true 
  },
  async (req, email, password, done) => {
    try {
      const exists = await User.findOne({ email });
      if (exists) {
        return done(null, false, { message: 'El email ya está registrado' });
      }

       const newCart = await cartRepository.create({ products: [] });

      const user = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email,
        age: req.body.age,
        password: password,
        role: req.body.role || 'user',
        cart: newCart._id
      });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Estrategia para login
passport.use("login", new LocalStrategy(
  { 
    usernameField: 'email', 
    passwordField: 'password' 
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Estrategia "current"
passport.use("current", new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user); 
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;