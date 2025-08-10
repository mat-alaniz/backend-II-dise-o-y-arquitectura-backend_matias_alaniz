import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";
import dotenv from "dotenv";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.sub);
        if (user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export const authenticateJwt = passport.authenticate('jwt', { session: false });


export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado: solo para administradores' });
};