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
      try {
        console.log('Preparando para generar el secreto 2FA para:', data.email);
        //const { secret, otpauth_url } = TwoFactor.generateSecret({ name: 'software', account: data.email });
        //console.log('2FA Secret generated:', secret);

        pool.query(
          'INSERT INTO usuarios (name, email, password, dpi, location,has_agreed_to_privacy_policy) VALUES ($1, $2, $3, $4, $5, $6)',
          [data.name, data.email, hashedPassword, data.dpi, data.location, false], // Assume 2FA is not enabled by default
          (err) => {
            if (err) {
              console.error('Error al insertar usuario:', err);
              throw new Meteor.Error('database-error', 'Error al insertar usuario en la base de datos');
            }
            console.log('Usuario insertado correctamente en PostgreSQL');
          }
        );
      } catch (error) {
        throw new Meteor.Error('2fa-error', 'Failed to generate 2FA secret');
      }
    },

    'usuarios.authenticate'(email, password) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
          if (err) {
            console.error('Database authentication error:', err);
            reject(new Meteor.Error('database-error', 'Error al autenticar en la base de datos'));
            return;
          }

          if (result.rows.length === 0) {
            console.log('Usuario no encontrado');
            resolve({ authenticated: false });
            return;
          }

          const user = result.rows[0];
          const passwordCorrect = bcrypt.compareSync(password, user.contraseña);

          if (!passwordCorrect) {
            console.log('Contraseña incorrecta');
            resolve({ authenticated: false });
            return;
          }

          // Generar y enviar código 2FA si está habilitado
          if (user.two_factor_enabled) {
            const twoFactorCode = Random.secret(6);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10); // El código expira después de 10 minutos

            pool.query(
              'UPDATE usuarios SET two_factor_code = $1, two_factor_expires_at = $2 WHERE email = $3',
              [twoFactorCode, expiresAt, email],
              (error) => {
                if (error) {
                  console.error('Error al actualizar usuario con código 2FA:', error);
                  reject(new Meteor.Error('database-error', 'Error al actualizar usuario con código 2FA'));
                  return;
                }

                // Enviar el código por correo electrónico
                const mailOptions = {
                  from: 'tu_usuario@gmail.com',
                  to: email,
                  subject: 'Tu código de verificación 2FA',
                  text: `Tu código de verificación es: ${twoFactorCode}`
                };

                transporter.sendMail(mailOptions, (error) => {
                  if (error) {
                    console.error('Error al enviar correo electrónico con código 2FA:', error);
                    reject(new Meteor.Error('email-error', 'Error al enviar correo electrónico con código 2FA'));
                    return;
                  }
                  resolve({ authenticated: true, twoFactorRequired: true });
                });
              }
            );
          } else {
            resolve({ authenticated: true, twoFactorRequired: false });
          }
        });
      });
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
    'productos.insert'(productoData) {
      check(productoData, Object);
      const { nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales } = productoData;
    
      // Manejar campos vacíos o nulos
      const nombreSanitizado = nombre || '';
      const descripcionSanitizada = descripcion || '';
      const precioSanitizado = precio || 0;
      const categoriaSanitizada = categoria || '';
      const estadoSanitizado = estado || '';
      const imagenPrincipalSanitizada = imagen_principal || '';
      const imagenesAdicionalesSanitizadas = imagenes_adicionales || [];
    
      console.log('Datos del producto:', productoData); // Agrega este registro de depuración
    
      pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [nombreSanitizado, descripcionSanitizada, precioSanitizado, categoriaSanitizada, estadoSanitizado, imagenPrincipalSanitizada, imagenesAdicionalesSanitizadas],
        (err) => {
          if (err) {
            console.error('Error al insertar producto:', err); // Agrega este registro de depuración
            throw new Meteor.Error('database-error', 'Error al insertar producto en la base de datos');
          }
          console.log('Producto insertado correctamente en PostgreSQL');
          return { success: true, message: 'Producto agregado correctamente' };
        }
      );
    },

    'productos.getAll'() {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM productos', (err, result) => {
          if (err) {
            console.error('Error al obtener productos:', err);
            reject(new Meteor.Error('database-error', 'Error al obtener productos de la base de datos'));
          } else {
            resolve(result.rows);
          }
        });
      });
    },

    'usuarios.verifyTwoFactorCode': async function (email, token) {
      check(email, String);
      check(token, String);
  
      // Asegúrate de que el correo electrónico y el token se proporcionen
      if (!email || !token) {
        throw new Meteor.Error('invalid-arguments', 'Email and token are required.');
      }
  
      try {
        // Busca el usuario en la base de datos por correo electrónico y recupera el secreto 2FA
        const result = await pool.query('SELECT two_factor_secret FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          throw new Meteor.Error('user-not-found', 'No user found with that email address.');
        }
  
        const user = result.rows[0];
  
        // Verificar el token usando el secreto almacenado
        const verified = speakeasy.totp.verify({
          secret: user.two_factor_secret,
          encoding: 'base32',
          token: token,
          window: 5 // Ajusta este valor según sea necesario para permitir más o menos desviación de tiempo
        });
  
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


