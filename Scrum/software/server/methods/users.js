import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import bcrypt from 'bcrypt';
import { pool } from '../PostgreSQL/db/postgres';
import { generateTwoFactorSecret, generateQRCode, verifyTwoFactorToken } from '../utils/2FA.js';

Meteor.methods({
  'usuarios.insert'(data) {
    console.log("Datos recibidos para inserción:", data);

    check(data, {
      name: String,
      email: String,
      password: String,
      dpi: String,
      location: String,
      hasAgreedToPrivacyPolicy: Boolean,
      enable_2fa: Boolean
    });

    const hashedPassword = bcrypt.hashSync(data.password, 10);
    pool.query(
      'INSERT INTO usuarios (name, email, password, dpi, location, has_agreed_to_privacy_policy, enable_2fa) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [data.name, data.email, hashedPassword, data.dpi, data.location, data.hasAgreedToPrivacyPolicy, data.enable_2fa],
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

    const { secret, otpauthUrl } = generateTwoFactorSecret(userId);

    return pool.query('UPDATE usuarios SET two_factor_secret = $1, enable_2fa = true WHERE id = $2 RETURNING *', [secret, userId])
      .then(result => {
        if (result.rowCount === 0) {
          throw new Meteor.Error('user-not-found', 'No user found with that ID.');
        }
        return generateQRCode(otpauthUrl);
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
        const verified = verifyTwoFactorToken(user.two_factor_secret, token);

        if (!verified) {
          throw new Meteor.Error('invalid-token', 'The provided token is invalid or expired.');
        }
        return true;
      })
      .catch(err => {
        console.error('Error verifying 2FA code:', err);
        throw new Meteor.Error('2fa-verification-error', 'Error verifying 2FA code');
      });
  }
});
