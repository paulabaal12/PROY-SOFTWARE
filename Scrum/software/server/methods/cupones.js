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
});
