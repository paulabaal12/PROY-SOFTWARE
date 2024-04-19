import { Meteor } from 'meteor/meteor';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { TwoFactor } from 'meteor/accounts-2fa';
import { Accounts } from 'meteor/accounts-base';

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

    'usuarios.authenticate'(email, password, twoFactorCode) {
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

          if (!user.two_factor_enabled) {
            console.log('Usuario autenticado exitosamente sin 2FA');
            resolve({ authenticated: true });
            return;
          }

          const verified = TwoFactor.verifyCode({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: twoFactorCode
          });

          if (verified) {
            console.log('Autenticación de 2FA exitosa');
            resolve({ authenticated: true });
          } else {
            console.log('Código 2FA incorrecto');
            resolve({ authenticated: false });
          }
        });
      });
    }
  });
});
