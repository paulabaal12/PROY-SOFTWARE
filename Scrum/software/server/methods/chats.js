import { Meteor } from 'meteor/meteor';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'chats.create'(venta_id, vendedor_id, comprador_id, repartidor_id) {
    const query = `
      INSERT INTO chats (venta_id, vendedor_id, comprador_id, repartidor_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [venta_id, vendedor_id, comprador_id, repartidor_id];

    try {
      const result = Promise.await(pool.query(query, values));
      return result.rows[0].id; // Return the ID of the newly created chat
    } catch (error) {
      throw new Meteor.Error('Database error', error.message);
    }
  },

  'chats.sendMessage'(chat_id, usuario_id, contenido) {
    const query = `
      INSERT INTO mensajes (chat_id, usuario_id, contenido)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [chat_id, usuario_id, contenido];

    try {
      const result = Promise.await(pool.query(query, values));
      return result.rows[0].id; // Return the ID of the newly created message
    } catch (error) {
      throw new Meteor.Error('Database error', error.message);
    }
  },

  'chats.getMessages'(chat_id) {
    const query = `
      SELECT mensajes.id, mensajes.contenido, mensajes.timestamp, usuarios.name AS sender_name
      FROM mensajes
      JOIN usuarios ON mensajes.usuario_id = usuarios.id
      WHERE chat_id = $1
      ORDER BY mensajes.timestamp ASC;
    `;
    const values = [chat_id];

    try {
      const result = Promise.await(pool.query(query, values));
      return result.rows; // Return all messages from the chat
    } catch (error) {
      throw new Meteor.Error('Database error', error.message);
    }
  },

  'chats.getUserChats'(usuario_id) {
    const query = `
      SELECT chats.id, chats.venta_id, ventas.monto, ventas.estado
      FROM chats
      JOIN ventas ON chats.venta_id = ventas.id_venta
      WHERE chats.vendedor_id = $1 OR chats.comprador_id = $1 OR chats.repartidor_id = $1;
    `;
    const values = [usuario_id];

    try {
      const result = Promise.await(pool.query(query, values));
      return result.rows;
    } catch (error) {
      throw new Meteor.Error('Database error', error.message);
    }
  },
});

