import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import Cart from '../models/cartModel.js';
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
passport.use("register", new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true, session: false },
    async (req, email, password, done) => {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) return done(null, false, { message: 'El usuario ya existe' });

            const { first_name, last_name, age } = req.body;

            let cart = await cart.create({ products: [] });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
                cart: cart._id
            });

            
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }
));

//estrategia para login
passport.use("login", new LocalStrategy(
    { usernameField: 'email', session: false },
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email }).populate('cart');
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;