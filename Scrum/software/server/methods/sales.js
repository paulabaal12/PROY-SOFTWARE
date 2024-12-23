import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'ventas.getAll'() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ventas', (err, result) => {
        if (err) {
          console.error('Error al obtener ventas:', err);
          reject(new Meteor.Error('database-error', 'Error al obtener ventas de la base de datos'));
        } else {
          resolve(result.rows);
        }
      });
    });
  }
});
