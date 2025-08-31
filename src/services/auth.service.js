//SERVICE DE RECUPERACIÓN DE CONTRASEÑA

import crypto from 'crypto';
import User from '../models/user.model.js';
import transporter from '../config/email.config.js';

// import transporter from '../config/email.config.js'; // Removed unused import

export class AuthService {
//// 🔐 GENERAR TOKEN DE RECUPERACIÓN
    async generateResetToken(email) {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ email });
            if (!user) throw new Error('Usuario no encontrado');

            //generar token unico con fecha de expiracion de 1 hora
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetPasswordExpires = Date.now() + 3600000; // 1 hora

            //guardar en la base de datos
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetPasswordExpires;

            await user.save();
            return resetToken;
        } catch (error) {
            throw new Error(`Error al generar el token de recuperación: ${error.message}`);
        }
    }

    //enviar correo de recuperacion
    async sendResetEmail(email, resetToken) {
        try {
            const resetUrl = `http://localhost:8081/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperación de Contraseña',
                html: `
                <h1>Recupera tu contraseña</h1>
                <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Restablecer Contraseña
                </a>
                <p>El enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este email.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            
        } catch (error) {
            throw new Error(`Error enviando email: ${error.message}`);
        }
    }

    // validacion token de reset
    async validateResetToken(token) {
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) throw new Error('Token de recuperación inválido o expirado');
            return user;
        } catch (error) {
            throw new Error(`Error validando el token de recuperación: ${error.message}`);
        }
    }

    //restablecer contraseña
    async resetPassword(token, newPassword) {
        try {
            const user = await this.validateResetToken(token);

            //verificar q no sea la misma contraseña
            if(user.password === newPassword){
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        } catch (error) {
            throw new Error(`Error al restablecer la contraseña: ${error.message}`);
        }
    }
}

export default new AuthService();
