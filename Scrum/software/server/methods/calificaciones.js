import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'calificaciones.getByProducto'(productoId) {
    check(productoId, Number);

    return new Promise((resolve, reject) => {
      pool.query(
        `
        SELECT c.calificacion, c.comentario, u.name AS usuario_nombre
        FROM calificaciones c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.producto_id = $1
        `,
        [productoId],
        (err, result) => {
          if (err) {
            console.error('Error al obtener calificaciones:', err);
            reject(new Meteor.Error('database-error', 'Error al obtener calificaciones'));
          } else {
            resolve(result.rows);
          }
        }
      );
    });
  },

  'calificaciones.insert'(calificacion) {
    check(calificacion, {
      producto_id: Number,
      usuario_id: Number, // Cambiado a Number para mantener la consistencia con la DB
      calificacion: Number,
      comentario: String,
    });

    const { producto_id, usuario_id, calificacion: rating, comentario } = calificacion;

    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO calificaciones (producto_id, usuario_id, calificacion, comentario) VALUES ($1, $2, $3, $4)',
        [producto_id, usuario_id, rating, comentario],
        (err) => {
          if (err) {
            console.error('Error al insertar calificación:', err);
            reject(new Meteor.Error('database-error', 'Error al insertar calificación en la base de datos'));
          } else {
            console.log('Calificación insertada correctamente');
            resolve('Calificación insertada con éxito');
          }
        }
      );
    });
  },
});
