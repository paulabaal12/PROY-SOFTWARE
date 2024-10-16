// server/methods/products.js

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { pool } from '../PostgreSQL/db/conn';
import Fuse from 'fuse.js';

// Diccionario de sinónimos
const sinonimos = {
  celular: ["teléfono", "móvil"],
  laptop: ["computadora portátil", "notebook"],
  cd: ["cd", "disco", "Cd", "CD"],
  // Agrega más sinónimos aquí según sea necesario
};

Meteor.methods({
  'productos.insert'(productoData) {
    check(productoData, Object);

    const { usuario_id, nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales } = productoData;

    pool.query(
      'INSERT INTO productos (usuario_id, nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [usuario_id, nombre || '', descripcion || '', precio || 0, categoria || '', estado || '', imagen_principal || '', imagenes_adicionales || []],
      (err) => {
        if (err) {
          console.error('Error al insertar producto:', err);
          throw new Meteor.Error('database-error', 'Error al insertar producto en la base de datos');
        }
        console.log('Producto insertado correctamente en PostgreSQL');
      }
    );
  },

  'productos.getAll'() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos', (err, result) => {
        if (err) {
          console.error('Error al obtener productos:', err);
          reject(new Meteor.Error('database-error', 'Error al obtener productos de la base de datos'));
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  'productos.update'(productoId, productoData) {
    check(productoId, Number);
    check(productoData, {
      nombre: String,
      descripcion: String,
      precio: Number,
      categoria: String,
      estado: String,
      imagen_principal: String,
      imagenes_adicionales: [String],
    });

    pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, estado = $5, imagen_principal = $6, imagenes_adicionales = $7 WHERE id = $8',
      [productoData.nombre, productoData.descripcion, productoData.precio, productoData.categoria, productoData.estado, productoData.imagen_principal, productoData.imagenes_adicionales, productoId],
      (err) => {
        if (err) {
          console.error('Error al actualizar el producto:', err);
          throw new Meteor.Error('database-error', 'Error al actualizar el producto en la base de datos');
        }
      }
    );
  },

  'productos.delete'(productoId) {
    check(productoId, Number);

    pool.query(
      'DELETE FROM productos WHERE id = $1',
      [productoId],
      (err) => {
        if (err) {
          console.error('Error al eliminar el producto:', err);
          throw new Meteor.Error('database-error', 'Error al eliminar el producto de la base de datos');
        }
      }
    );
  },

  'productos.getAll_id'(productoId) {
    check(productoId, Number);

    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos WHERE id = $1', [productoId], (err, result) => {
        if (err) {
          reject(new Meteor.Error('database-error', 'Error al obtener productos de la base de datos'));
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  'productos.getByUser'(userId) {
    check(userId, Number);

    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos WHERE usuario_id = $1', [userId], (err, result) => {
        if (err) {
          reject(new Meteor.Error('database-error', 'Error al obtener productos del usuario en la base de datos'));
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  'productos.search'(searchQueries) {
    check(searchQueries, [String]); // Verifica que sea una lista de strings

    console.log('Buscando productos con consultas expandidas:', searchQueries);

    return new Promise((resolve, reject) => {
      // Genera una consulta dinámica para cada término de búsqueda usando OR
      const conditions = searchQueries.map((_, index) => 
        `nombre ILIKE $${index + 1} OR descripcion ILIKE $${index + 1}`
      ).join(' OR ');
      
      const query = `
        SELECT * FROM productos 
        WHERE ${conditions}
        LIMIT 50
      `;
      
      const values = searchQueries.map(term => `%${term}%`); // Agrega % para permitir coincidencias parciales

      pool.query(query, values, (err, result) => {
        if (err) {
          console.error('Error al buscar productos:', err);
          reject(new Meteor.Error('database-error', 'Error al buscar productos en la base de datos'));
        } else {
          console.log('Resultados de búsqueda:', result.rows);
          resolve(result.rows);
        }
      });
    });
  },
});
