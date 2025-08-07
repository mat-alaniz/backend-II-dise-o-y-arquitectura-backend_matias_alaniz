

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, message: "el nombre es obligatorio" },
    last_name: { type: String, required: true, message: "el apellido es obligatorio" },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/, message: "Por favor ingrese un email válido" },
    password: { type: String, required: true, minlength: 6, message: "la contraseña es obligatoria y debe tener al menos 6 caracteres" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('User', userSchema);
