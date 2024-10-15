import { Meteor } from 'meteor/meteor';
import { pool } from '../PostgreSQL/db/conn'; // Asegúrate de que la conexión esté bien configurada

// Pre-registrar métodos de pago si no existen
async function initializePaymentMethods() {
  const defaultMethods = [
    { tipo_metodo: 'Transferencia', detalles: { banco: '', cuenta: '' } },
    { tipo_metodo: 'PayPal', detalles: { paypal_id: '', paypal_secret: '' } },
    { tipo_metodo: 'Pago contra entrega', detalles: {} },
  ];

  try {
    for (const method of defaultMethods) {
      const result = await pool.query(
        'SELECT * FROM metodos_pago WHERE tipo_metodo = $1',
        [method.tipo_metodo]
      );

      if (result.rows.length === 0) {
        await pool.query(
          'INSERT INTO metodos_pago (usuario_id, tipo_metodo, detalles) VALUES ($1, $2, $3)',
          [1, method.tipo_metodo, method.detalles]
        );
        console.log(`Método de pago ${method.tipo_metodo} registrado.`);
      }
    }
  } catch (err) {
    console.error('Error al inicializar los métodos de pago:', err);
  }
}

Meteor.startup(() => {
  initializePaymentMethods(); // Llamar al inicio de la app
});

Meteor.methods({
  'paymentMethods.get': async function (usuarioId) {
    try {
      const result = await pool.query(
        'SELECT * FROM metodos_pago WHERE usuario_id = $1',
        [usuarioId]
      );
      return result.rows;
    } catch (err) {
      console.error('Error al obtener los métodos de pago:', err);
      throw new Meteor.Error('Error al obtener los métodos de pago', err.message);
    }
  },

  'paymentMethods.update': async function (id, detalles) {
    try {
      await pool.query(
        'UPDATE metodos_pago SET detalles = $1 WHERE id = $2',
        [detalles, id]
      );
      return { message: 'Método de pago actualizado correctamente' };
    } catch (err) {
      console.error('Error al actualizar el método de pago:', err);
      throw new Meteor.Error('Error al actualizar el método de pago', err.message);
    }
  },

  'paymentHistory.get': async function (usuarioId) {
    try {
      const result = await pool.query(
        'SELECT * FROM ventas WHERE vendedor_id = $1 ORDER BY fecha_inicio DESC',
        [usuarioId]
      );
      return result.rows;
    } catch (err) {
      console.error('Error al obtener el historial de pagos:', err);
      throw new Meteor.Error('Error al obtener el historial de pagos', err.message);
    }
  },
});
