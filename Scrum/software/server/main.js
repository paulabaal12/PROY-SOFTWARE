import { Meteor } from 'meteor/meteor';
import { Pool } from 'pg';

Meteor.startup(() => {
  const pgConfig = Meteor.settings?.postgres || {
    host: 'localhost',
    port: '5432',
    database: 'users_database',
    username: 'postgres',
    password: ''
  };

  const pool = new Pool({
    host: pgConfig.host,
    port: pgConfig.port,
    database: pgConfig.database,
    user: pgConfig.username,
    password: pgConfig.password
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error de conexión a PostgreSQL:', err);
    } else {
      console.log('Conexión exitosa a PostgreSQL');
      release();
    }
  });

  Meteor.methods({
    'usuarios.insert'(data) {
      pool.query(
        'INSERT INTO usuarios (nombre, email, contraseña, dpi, ubicacion) VALUES ($1, $2, $3, $4, $5)',
        [data.name, data.email, data.password, data.dpi, data.location],
        (err, result) => {
          if (err) {
            console.error('Error al insertar usuario en PostgreSQL:', err);
            throw new Meteor.Error('database-error', 'Error al insertar usuario en la base de datos');
          } else {
            console.log('Usuario insertado correctamente en PostgreSQL');
          }
        }
      );
    },
    'usuarios.authenticate'(email, password) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM usuarios WHERE email = $1 AND contraseña = $2', [email, password], (err, result) => {
          if (err) {
            console.error('Error al autenticar:', err);
            reject(new Meteor.Error('database-error', 'Error al autenticar en la base de datos'));
          } else {
            const authenticated = result.rows.length > 0;
            resolve({ authenticated });
            if (authenticated) {
              console.log('Usuario existe en la base de datos, inicia sesión');
            } else {
              console.log('Usuario no existe en la base de datos');
            }
          }
        });
      });
    }
  });
});

