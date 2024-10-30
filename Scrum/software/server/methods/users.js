import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import bcrypt from 'bcrypt';
import { pool } from '../PostgreSQL/db/conn';
import { generateTwoFactorSecret, generateQRCode, verifyTwoFactorToken } from '../utils/2FA.js';

console.log(pool); // Verificar que pool no es undefined

Meteor.methods({
  // Método para insertar usuario
  'usuarios.insert'(data) {
    console.log("Datos recibidos para inserción:", data);

    check(data, {
      name: String,
      email: String,
      password: String,
      dpi: String,
      location: String,
      hasAgreedToPrivacyPolicy: Boolean,
      enable_2fa: Boolean,
    });

    console.log("Preparando consulta para insertar usuario en PostgreSQL");
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    pool.query(
      'INSERT INTO usuarios (name, email, password, dpi, location, has_agreed_to_privacy_policy, enable_2fa) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [data.name, data.email, hashedPassword, data.dpi, data.location, data.hasAgreedToPrivacyPolicy, data.enable_2fa],
      (err) => {
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
  
          // Devuelve el userId como parte de la respuesta
          resolve({
            authenticated: true,
            twoFactorRequired: !!user.enable_2fa,
            userId: user.id,
          });
        });
      });
    },
  

  // Método para habilitar la autenticación de dos factores
  'usuarios.enableTwoFactorAuth'(userId) {
    check(userId, Number);

    const { secret, otpauthUrl } = generateTwoFactorSecret(userId);

    return pool.query('UPDATE usuarios SET two_factor_secret = $1, enable_2fa = true WHERE id = $2 RETURNING *', [secret, userId])
      .then((result) => {
        if (result.rowCount === 0) {
          throw new Meteor.Error('user-not-found', 'No user found with that ID.');
        }
        return generateQRCode(otpauthUrl);
      })
      .catch((err) => {
        console.error('Error enabling 2FA:', err);
        throw new Meteor.Error('2fa-error', 'Failed to enable 2FA');
      });
  },

  // Método para verificar el código de 2FA
  'usuarios.verifyTwoFactorCode'(userId, token) {
    check(userId, Number);
    check(token, String);

    return pool.query('SELECT two_factor_secret FROM usuarios WHERE id = $1', [userId])
      .then((result) => {
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
      .catch((err) => {
        console.error('Error verifying 2FA code:', err);
        throw new Meteor.Error('2fa-verification-error', 'Error verifying 2FA code');
      });
  },



  'usuarios.getNombre'(userId) {
    check(userId, Number); // Validar el tipo de dato
    return new Promise((resolve, reject) => {
      pool.query('SELECT name FROM usuarios WHERE id = $1', [userId], (err, result) => {
        if (err) {
          console.error('Error al obtener el nombre del usuario:', err);
          reject(new Meteor.Error('database-error', 'Error al obtener el nombre del usuario'));
        } else if (result.rows.length > 0) {
          resolve(result.rows[0].name); // Devolver el nombre del usuario
        } else {
          resolve('Usuario'); // Valor por defecto si no se encuentra
        }
      });
    });
  },


  
  // Método para iniciar sesión con Google
  async 'usuarios.googleLogin'(googleUser) {
    console.log('Datos recibidos de Google:', googleUser); // Verificar que los datos lleguen correctamente

    check(googleUser, {
      email: String,
      name: String,
      picture: String, 
      googleId: String,
    });

    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [googleUser.email]);

      if (result.rows.length === 0) {
        console.log('Insertando usuario en la base de datos:', googleUser);
        const insertResult = await pool.query(
          'INSERT INTO usuarios (name, email, profile_picture) VALUES ($1, $2, $3) RETURNING id',
          [googleUser.name, googleUser.email, googleUser.picture]
        );

        console.log('Usuario creado exitosamente:', insertResult.rows[0].id);
        return { authenticated: true, userId: insertResult.rows[0].id };
      } else {
        console.log('Usuario existente:', result.rows[0].id);
        return { authenticated: true, userId: result.rows[0].id };
      }
    } catch (error) {
      console.error('Error al insertar/consultar usuario en la base de datos:', error);
      throw new Meteor.Error('database-error', 'Error al autenticar con Google');
    }
  },

  // Método para registrar usuario con Google
  // Método para registrar usuario con Google
async 'usuarios.googleRegister'(googleUser) {
  console.log('Datos recibidos de Google para registro:', googleUser); 
  
  check(googleUser, {
    email: String,
    name: String,
    picture: String,
  });

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [googleUser.email]);

    console.log('Resultado de la consulta:', result.rows); // Verificar el resultado de la consulta

    if (result.rows.length === 0) {
      console.log('Insertando usuario de Google en la base de datos:', googleUser);
      const insertResult = await pool.query(
        'INSERT INTO usuarios (name, email, profile_picture) VALUES ($1, $2, $3) RETURNING id',
        [googleUser.name, googleUser.email, googleUser.picture]
      );

      console.log('Usuario de Google registrado exitosamente:', insertResult.rows[0].id);
      return { authenticated: true, userId: insertResult.rows[0].id };
    } else {
      console.log('Usuario de Google ya registrado, ID:', result.rows[0].id);
      return { authenticated: true, userId: result.rows[0].id };
    }
  } catch (error) {
    console.error('Error al registrar usuario con Google:', error);
    throw new Meteor.Error('database-error', 'Error al registrar usuario con Google');
  }
},


});
