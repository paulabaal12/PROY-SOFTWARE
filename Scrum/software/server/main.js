import { Meteor } from 'meteor/meteor';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { Random } from 'meteor/random';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';  // Asegúrate de que QRCode también esté instalado
import { check } from 'meteor/check';
// Configuración para el servicio de email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiarlo por tu servicio de correo electrónico preferido
  auth: {
    user: 'tu_usuario@gmail.com',
    pass: 'tu_contraseña'
  }
});

Meteor.startup(() => {
  const pgConfig = Meteor.settings.postgres || {
    host: 'localhost',
    port: 5432,
    database: 'users_database',
    user: 'postgres',
    password: ''
  };

  const pool = new Pool(pgConfig);

  pool.connect((err) => {
    if (err) {
      console.error('Error de conexión a PostgreSQL:', err);
    } else {
      console.log('Conexión exitosa a PostgreSQL');
    }
  });

  Meteor.methods({
    'usuarios.insert'(data) {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
    
      pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [data.email],
        (err, result) => {
          if (err) {
            throw new Meteor.Error('database-error', 'Error al verificar el correo electrónico');
          }
          if (result.rows.length > 0) {
            throw new Meteor.Error('email-exists', 'El correo electrónico ya está registrado.');
          } else {
            pool.query(
              'INSERT INTO usuarios (nombre, email, contraseña, dpi, ubicacion, two_factor_enabled) VALUES ($1, $2, $3, $4, $5, $6)',
              [data.name, data.email, hashedPassword, data.dpi, data.location, data.enable2FA],
              (error) => {
                if (error) {
                  throw new Meteor.Error('database-error', 'Error al insertar usuario en la base de datos');
                }
                console.log('Usuario insertado correctamente en PostgreSQL');
              }
            );
          }
        }
      );
    },
    

    'usuarios.authenticate': async (data) => {
      const { email, password } = data;
      try {
        console.log('Consultando usuario con email:', email);
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
        console.log('Resultado de la consulta:', result.rows);
        if (result.rows.length === 0) {
          console.log('Usuario no encontrado');
          return { authenticated: false };
        }
    
        const user = result.rows[0];
        const passwordCorrect = bcrypt.compareSync(password, user.contraseña);
    
        if (!passwordCorrect) {
          console.log('Contraseña incorrecta');
          return { authenticated: false };
        }
    
        if (user.two_factor_enabled) {
          const otpauthUrl = speakeasy.otpauthURL({
            secret: user.two_factor_secret,
            label: encodeURIComponent(email),
            issuer: 'NombreDeTuApp'
          });
          const dataURL = await QRCode.toDataURL(otpauthUrl);
          return { authenticated: true, twoFactorRequired: true, qrCode: dataURL };
        } else {
          return { authenticated: true, twoFactorRequired: false };
        }
      } catch (err) {
        console.error('Database authentication error:', err);
        throw new Meteor.Error('database-error', 'Error al autenticar en la base de datos');
      }
    },
    
    
    
    
    'usuarios.generateTwoFactorAuth': async function (email) {
      const secret = speakeasy.generateSecret({ length: 20 });
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: encodeURIComponent(email),
        issuer: 'software'
      });
  
      // Usa async/await para asegurar que las operaciones asincrónicas se completen adecuadamente
      try {
        const result = await pool.query('UPDATE usuarios SET two_factor_secret = $1, two_factor_enabled = true WHERE email = $2', [secret.base32, email]);
        if (result.rowCount === 0) {
          throw new Meteor.Error('user-not-found', 'No user found with that email address.');
        }
        // Solo envía otpauthUrl al cliente
        return { otpauthUrl };
      } catch (error) {
        throw new Meteor.Error('error-generating-secret', 'Failed to generate 2FA secret.');
      }
    },
    'usuarios.verifyTwoFactorCode': async function (email, token) {
      check(email, String);
      check(token, String);
    
      if (!email || !token) {
        throw new Meteor.Error('invalid-arguments', 'Email and token are required.');
      }
    
      try {
        const result = await pool.query('SELECT two_factor_secret FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          throw new Meteor.Error('user-not-found', 'No user found with that email address.');
        }
    
        const user = result.rows[0];
        console.log('Verifying 2FA token:', token, 'with secret:', user.two_factor_secret);
    
        const verified = speakeasy.totp.verify({
          secret: user.two_factor_secret,
          encoding: 'base32',
          token: token,
          window: 2 // Adjusted window for time drift
        });
    
        console.log('Verification attempt result:', verified);
    
        if (verified) {
          return true; // El token es correcto
        } else {
          throw new Meteor.Error('invalid-token', 'The provided token is invalid or expired.');
        }
      } catch (error) {
        console.error('Error verifying 2FA code:', error);
        throw new Meteor.Error('database-error', 'Error al verificar código 2FA');
      }
    }
    
    
    
    });
  });