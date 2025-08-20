import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';// despues preguta a copilot sinesto es nevesario
import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from './config.js';// esto tambien preguntarlee a copilot

const createHash = (password)  => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

  passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true,
  session: false,
}, async (req, email, password, done) => {
    try {
      const { firstName, lastName, age } = req.body;
      if (!firstName || !lastName || !email || !password || !age) {
        return done(null, false, { message: 'Todos los campos son obligatorios' });
      }
      const exists = await UserModel.findOne({ email });
      if (exists) {
        return done(null, false, { message: 'El usuario ya existe' });
      }
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        age,
        password: createHash(password),
        role: 'user',
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));


// Estrategia Local para login con email y password
passport.use('login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const ok = isValidPassword(user, password);
        if (!ok) return done(null, false, { message: 'Credenciales invalidos' });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia JWT para rutas protegidas
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (jwt_payload, done) => {
      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialización y deserialización (opcional si usas sesiones)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;