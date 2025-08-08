//registro de usuario   
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/config.js';

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'campos requeridos y obligatorios' });
        }
        const user = await User.create({ first_name, last_name, email, age, password });
        res.status(201).json({ status: 'success', user: { id: user._id, email: user.email, role: user.role } });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res)=> {
    try {
        const { email, password } = req.body;
        if (!req.user) {
            return res.status(401).json({ error: 'credenciales inválidas' });
        }
        const token = jwt.sign({ id: req.user._id, email: req.user.email, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ status: 'success', token, user: { id: req.user._id, email: req.user.email, role: req.user.role } });
    } catch (error) {
        res.status(500).json({ error: 'error en el servidor' });
    }
};
export const current = async (req, res) => {
    try{
        res.status(200).json({ status: 'success', user: { id: req.user._id, email: req.user.email, role: req.user.role } });
    } catch (error) {
        res.status(500).json({ error: 'error en el servidor' });
    }
};