
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user.model.js';
import { JWT_SECRET } from './config.js';


passport.use('login', new LocalStrategy(
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
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return done(null, false, { message: 'Contraseña incorrecta' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('jwt', new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    },
    async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false, { message: 'usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;