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
      check(data, {
        name: String,
        email: String,
        password: String,
        dpi: String,
        location: String,
        has_agreed_to_privacy_policy: Boolean
      });

      const hashedPassword = bcrypt.hashSync(data.password, 10);
      pool.query(
        'INSERT INTO usuarios (name, email, password, dpi, location, has_agreed_to_privacy_policy, enable_2fa) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [data.name, data.email, hashedPassword, data.dpi, data.location, data.has_agreed_to_privacy_policy, false],
        err => {
          if (err) {
            console.error('Error al insertar usuario:', err);
            throw new Meteor.Error('database-error', 'Error al insertar usuario en la base de datos');
          }
          console.log('Usuario insertado correctamente en PostgreSQL');
        }
      );
    },

    'usuarios.authenticate'(email, password) {
      return new Promise((resolve, reject) => {
        check(email, String);
        check(password, String);

        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
          if (err) {
            console.error('Database authentication error:', err);
            reject(new Meteor.Error('database-error', 'Error al autenticar en la base de datos'));
            return;
          }

          if (result.rows.length === 0) {
            resolve({ authenticated: false });
            return;
          }

          const user = result.rows[0];
          const passwordCorrect = bcrypt.compareSync(password, user.password);

          if (!passwordCorrect) {
            resolve({ authenticated: false });
            return;
          }

          if (user.enable_2fa) {
            resolve({ authenticated: true, twoFactorRequired: true, userId: user.id });
          } else {
            resolve({ authenticated: true, twoFactorRequired: false });
          }
        });
      });
    },

    'usuarios.enableTwoFactorAuth'(userId) {
      check(userId, Number);

      const secret = speakeasy.generateSecret({ length: 20 });
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: encodeURIComponent(userId.toString()),
        issuer: 'TuAplicacion'
      });

      return pool.query('UPDATE usuarios SET two_factor_secret = $1, enable_2fa = true WHERE id = $2 RETURNING *', [secret.base32, userId])
        .then(result => {
          if (result.rowCount === 0) {
            throw new Meteor.Error('user-not-found', 'No user found with that ID.');
          }
          return QRCode.toDataURL(otpauthUrl);
        })
        .catch(err => {
          console.error('Error enabling 2FA:', err);
          throw new Meteor.Error('2fa-error', 'Failed to enable 2FA');
        });
    },

    'usuarios.verifyTwoFactorCode'(userId, token) {
      check(userId, Number);
      check(token, String);

      return pool.query('SELECT two_factor_secret FROM usuarios WHERE id = $1', [userId])
        .then(result => {
          if (result.rows.length === 0) {
            throw new Meteor.Error('user-not-found', 'No user found with that ID.');
          }
          const user = result.rows[0];
          const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: token,
            window: 2
          });

          if (!verified) {
            throw new Meteor.Error('invalid-token', 'The provided token is invalid or expired.');
          }
          return true;
        })
        .catch(err => {
          console.error('Error verifying 2FA code:', err);
          throw new Meteor.Error('2fa-verification-error', 'Error verifying 2FA code');
        });
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


