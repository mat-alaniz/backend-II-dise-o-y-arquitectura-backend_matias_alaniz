import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/config.js';


export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Todos los campos son obligatorios'
            });
        }
        const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        res.status(201).json({
            status: 'success',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                error: 'El email ya está registrado'
            });
        }
        res.status(500).json({
            status: 'error',
            error: 'Error en el registro'
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                error: 'Credenciales inválidas'
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                error: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error en el login'
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
            role: req.user.role
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