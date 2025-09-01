import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

export class EmailService {
    constructor() {
        console.log('📧 Configurando email con:', config.email.user);
        
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,            
            auth: {
                user: config.email.user,
                pass: config.email.pass
            }
        });
        
        // Verificar conexión
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Error configurando email:', error);
            } else {
                console.log('✅ Servicio de email configurado correctamente');
            }
        });
    }

    async sendEmail(to, subject, html) {
        try {
            console.log('📤 Intentando enviar email a:', to);
            
            const mailOptions = {
                from: 'E-commerce Mate <' + config.email.user + '>',
                to,
                subject,
                html
            };
            
            const result = await this.transporter.sendMail(mailOptions);
            
            console.log('✅ Email enviado exitosamente a:', to);
            console.log('📨 Message ID:', result.messageId);
            
            return result;
        } catch (error) {
            console.error('❌ Error al enviar email:', error.message);
            throw new Error('Error al enviar email');
        }
    }

    // método para enviar email de registro
    async sendRegisterEmail(userEmail, userName) {
        const subject = 'Bienvenido a nuestra tienda';
        const html = `
            <h1>Hola ${userName},</h1>
            <p>Gracias por registrarte en nuestra tienda. Estamos emocionados de tenerte a bordo.</p>
        `;
        return await this.sendEmail(userEmail, subject, html);
    }

    // método para enviar email de compra
    async sendPurchaseEmail(userEmail, userName, ticket) {
        const subject = '¡Compra realizada exitosamente!';
        const html = `
            <h1>¡Hola ${userName}!</h1>
            <p>Tu compra ha sido procesada exitosamente.</p>
            <p>Número de ticket: <strong>${ticket.code}</strong></p>
            <p>Total: <strong>$${ticket.amount}</strong></p>
            <p>Gracias por tu compra.</p>
        `;
        return await this.sendEmail(userEmail, subject, html);
    }
}

export default new EmailService();