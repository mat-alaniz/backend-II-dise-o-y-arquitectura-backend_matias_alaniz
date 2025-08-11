import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([ ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token'),
        (req) => req.cookies.jwt 
    ]),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.sub || jwtPayload.id); 
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export const authenticateJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Se requieren privilegios de administrador' 
    });
};

export const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) req.user = user;
        next();
    })(req, res, next);
};