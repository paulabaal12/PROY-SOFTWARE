import { Meteor } from 'meteor/meteor';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'cupones.validate'(codigoCupon) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      pool.query(
        'SELECT * FROM cupones WHERE codigo = $1 AND fecha_expiracion >= $2',
        [codigoCupon, today],
        (error, result) => {
          if (error || result.rows.length === 0) {
            reject(new Meteor.Error('invalid-coupon', 'Cupón inválido o expirado'));
          } else {
            resolve(result.rows[0]);
          }
        }
      );
    });
  },

  'cupones.apply'(couponData) {
    return new Promise((resolve, reject) => {
      console.log("Datos recibidos para aplicar el cupón:", couponData); // Log de datos recibidos

      // Validación de datos esenciales
      if (!couponData.codigo || !couponData.descuento || !couponData.producto_id || !couponData.fecha_expiracion) {
        console.error("Datos incompletos para aplicar el cupón"); // Log si faltan datos
        return reject(new Meteor.Error('invalid-data', 'Faltan datos para aplicar el cupón.'));
      }

      // Inserta el cupón en la tabla 'cupones'
      pool.query(
        'INSERT INTO cupones (codigo, descuento, producto_id, fecha_expiracion) VALUES ($1, $2, $3, $4) RETURNING *',
        [couponData.codigo, couponData.descuento, couponData.producto_id, couponData.fecha_expiracion],
        (error, result) => {
          if (error) {
            console.error("Error en la inserción del cupón:", error.message); // Log de error de inserción
            reject(new Meteor.Error('db-error', 'Error al aplicar el cupón'));
          } else if (result.rowCount === 0) {
            console.warn("Cupón no insertado"); // Log si no se insertó
            reject(new Meteor.Error('insert-failed', 'Error al insertar el cupón'));
          } else {
            console.log("Cupón aplicado exitosamente:", result.rows[0]); // Log de éxito
            resolve({ descuento: couponData.descuento });
          }
        }
      );
    });
  },
});
