import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const cookieExtractor = req => req.cookies?.jwt || null;

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));
// estrategia para registro
passport.use('register', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      // Verifica si el usuario ya existe
      const exists = await User.findOne({ email });
      if (exists) return done(null, false, { message: 'El email ya está registrado' });

      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea el usuario 
      const user = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email,
        age: req.body.age,
        password: hashedPassword
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

//estrategia para login
passport.use("login", new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async ( email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;