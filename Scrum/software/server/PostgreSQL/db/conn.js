import { Pool } from 'pg';
import { Meteor } from 'meteor/meteor';

const pgConfig = Meteor.settings.postgres || {
  host: 'localhost',
  port: 5432,
  database: 'data_base',
  user: 'user',
  password: 'password'
};

export const pool = new Pool(pgConfig);

pool.connect((err) => {
  if (err) {
    console.error('Error de conexión a PostgreSQL:', err);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
  }
});
