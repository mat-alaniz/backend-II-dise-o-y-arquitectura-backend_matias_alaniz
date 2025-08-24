import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';

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

export default passport;