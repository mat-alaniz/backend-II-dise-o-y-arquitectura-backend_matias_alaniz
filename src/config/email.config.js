//SISTEMA DE RECUPERACIÓN DE CONTRASEÑA

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Error configurando email:', error);
    } else {
        console.log('✅ Listo para enviar correos electrónicos');
    }
});

export default transporter;
