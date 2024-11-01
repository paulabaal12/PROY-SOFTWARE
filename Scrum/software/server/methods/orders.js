import { Meteor } from 'meteor/meteor'; 
import { check } from 'meteor/check';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'pedidos.getAll'() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM pedidos', (err, result) => {
        if (err) {
          console.error('Error fetching orders:', err);
          reject(new Meteor.Error('database-error', 'Error fetching orders from the database'));
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  'pedidos.updateEstado'(pedidoId, nuevoEstado) {
    check(pedidoId, Number);
    check(nuevoEstado, String);

    pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id_pedido = $2',
      [nuevoEstado, pedidoId],
      (err, result) => {
        if (err) {
          console.error('Error updating order status:', err);
          throw new Meteor.Error('database-error', 'Error updating order status in the database');
        }
        console.log('Order status updated successfully');
      }
    );
  },

  'pedidos.insert'(pedidoData) {
    console.log("Datos recibidos en el servidor:", pedidoData);

    // Validación de los datos de entrada
    check(pedidoData, {
      usuario_id: Number,
      total: Number,
      detalles: String,
      opcion_envio: String // Verifica que opcion_envio sea de tipo String
    });

    // Consulta para insertar en la tabla 'pedidos', incluyendo 'opcion_envio'
    pool.query(
      'INSERT INTO pedidos (usuario_id, total, detalles, opcion_envio) VALUES ($1, $2, $3, $4)',
      [pedidoData.usuario_id, pedidoData.total, pedidoData.detalles, pedidoData.opcion_envio],
      (err) => {
        if (err) {
          console.error('Error al insertar pedido:', err);
          throw new Meteor.Error('database-error', 'Error al insertar pedido en la base de datos');
        }
        console.log('Pedido insertado correctamente en PostgreSQL');
      }
    );
  },

  'pedidos.getAllWithAddresses'() {
    return new Promise((resolve, reject) => {
      pool.query(`
        SELECT p.id_pedido, p.usuario_id, p.total, p.estado, d.direccion_inicio, d.direccion_entrega 
        FROM pedidos p
        JOIN direcciones d ON p.direccion_id = d.id
      `, (err, result) => {
        if (err) {
          console.error('Error fetching deliveries:', err);
          reject(new Meteor.Error('database-error', 'Error fetching deliveries from the database'));
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  'pedidos.getByUser'(userId) {
    check(userId, Number); // Validamos el tipo de dato

    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM pedidos WHERE usuario_id = $1', [userId], (err, result) => {
        if (err) {
          console.error('Error fetching orders for user:', err);
          reject(new Meteor.Error('database-error', 'Error fetching user orders from the database'));
        } else {
          resolve(result.rows); // Retornamos los pedidos
        }
      });
    });
  },

  'pedidos.marcarDevolucion': async function (pedidoId) {
    const query = 'UPDATE pedidos SET devolucion = true WHERE id_pedido = $1';
    const values = [pedidoId];
    
    try {
      await pool.query(query, values); // pool es la conexión a PostgreSQL
      return { success: true };
    } catch (error) {
      throw new Meteor.Error('update-failed', 'No se pudo actualizar el pedido.');
    }
  },
});
