const nodemailer = require('nodemailer');
require('dotenv').config()
// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SEND_EMAIL_USERNAME,
        pass: process.env.SEND_EMAIL_PASSWORD //Aquí debes usar la contraseña de aplicación generada en Google
    }
});

// Función para enviar el correo electrónico
async function sendEmail(destinatario, asunto, mensaje) {
    const mailOptions = {
        from: process.env.SEND_EMAIL_USERNAME,
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
}

module.exports = { sendEmail };
