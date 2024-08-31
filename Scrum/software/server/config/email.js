import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu_usuario@gmail.com',
    pass: 'tu_contraseña'
  }
});