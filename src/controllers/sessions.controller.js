import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

export const issueToken = (req, res) => {
    try {
    
        if (req.authError) {
            return res.status(401).json({
                status: 'error',
                message: req.authError.message || 'Error de autenticación'
            });
        }

        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        const user = req.user;

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
            token,
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: 'Error al generar el token' 
        });
    }
};

export const current = (req, res) => {
    try {
        const userData = {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: user.role
        };

        res.status(200).json({
            status: 'success',
            user: userData
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener datos de usuario'
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({
            status: 'success',
            message: 'Sesión cerrada exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al cerrar sesión'
        });
    }
};