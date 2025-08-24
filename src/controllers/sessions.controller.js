import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/config.js';


export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).render('register', {
                error: 'Todos los campos son obligatorios'
            });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).render('register', {
                error: 'El email ya está registrado'
            });
        }

        // Guarda la contraseña en texto plano, el modelo la hasheará
        await User.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        return res.redirect('/login');

    } catch (error) {
        return res.status(500).render('error', { message: 'Error en el servidor' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        // Generar JWT y setear cookie httpOnly
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
        return res.status(200).json({
            status: 'success',
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ error: 'error en el servidor' });
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