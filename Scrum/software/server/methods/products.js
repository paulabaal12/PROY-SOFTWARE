import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { pool } from '../PostgreSQL/db/conn';

Meteor.methods({
  'productos.insert'(productoData) {
  check(productoData, Object);

  const { usuario_id, nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales } = productoData;

  const nombreSanitizado = nombre || '';
  const descripcionSanitizada = descripcion || '';
  const precioSanitizado = precio || 0;
  const categoriaSanitizada = categoria || '';
  const estadoSanitizado = estado || '';
  const imagenPrincipalSanitizada = imagen_principal || '';
  const imagenesAdicionalesSanitizadas = imagenes_adicionales || [];

  console.log('Datos del producto:', productoData);

  pool.query(
    'INSERT INTO productos (usuario_id, nombre, descripcion, precio, categoria, estado, imagen_principal, imagenes_adicionales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      usuario_id, 
      nombreSanitizado, 
      descripcionSanitizada, 
      precioSanitizado, 
      categoriaSanitizada, 
      estadoSanitizado, 
      imagenPrincipalSanitizada, 
      imagenesAdicionalesSanitizadas
    ],
    (err) => {
      if (err) {
        console.error('Error al insertar producto:', err);
        throw new Meteor.Error('database-error', 'Error al insertar producto en la base de datos');
      }
      console.log('Producto insertado correctamente en PostgreSQL');
      return { success: true, message: 'Producto agregado correctamente' };
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
          console.log('Productos obtenidos:', result.rows);
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
      (err, result) => {
        if (err) {
          console.error('Error al actualizar el producto:', err);
          throw new Meteor.Error('database-error', 'Error al actualizar el producto en la base de datos');
        }
        console.log('Producto actualizado correctamente en PostgreSQL');
      }
    );
  },

  'productos.delete'(productoId) {
    check(productoId, Number);

    pool.query(
      'DELETE FROM productos WHERE id = $1',
      [productoId],
      (err, result) => {
        if (err) {
          console.error('Error al eliminar el producto:', err);
          throw new Meteor.Error('database-error', 'Error al eliminar el producto de la base de datos');
        }
        console.log('Producto eliminado correctamente en PostgreSQL');
      }
    );
  },

  'productos.getAll_id'(productoId) {
    check(productoId, Number);
    console.log('Consultando producto con ID:', productoId);

    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos WHERE id = $1', [productoId], (err, result) => {
        if (err) {
          console.error('Error al obtener productos:', err);
          reject(new Meteor.Error('database-error', 'Error al obtener productos de la base de datos'));
        } else {
          if (result.rows.length > 0) {
            console.log('Producto encontrado:', result.rows[0]);
            resolve(result.rows);
          } else {
            console.log('Producto no encontrado');
            resolve([]);
          }
        }
      });
    });
  }, 

  'productos.search'(searchQuery) {
    check(searchQuery, String);

    console.log('Buscando productos con query:', searchQuery);

    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM productos 
        WHERE nombre ILIKE $1 OR descripcion ILIKE $1
        LIMIT 20
      `;
      const values = [`%${searchQuery}%`];

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
  


  'productos.getByUser'(userId) {
  check(userId, Number); // Verificamos que userId sea un número
  console.log('Consultando productos para el usuario con ID:', userId);

  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM productos WHERE usuario_id = $1';

    pool.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error al obtener productos del usuario:', err);
        reject(new Meteor.Error('database-error', 'Error al obtener productos del usuario en la base de datos'));
      } else {
        if (result.rows.length > 0) {
          console.log('Productos encontrados:', result.rows);
          resolve(result.rows);
        } else {
          console.log('No se encontraron productos para el usuario.');
          resolve([]); // Devolver un array vacío si no hay productos
        }
      }
    });
  });
}




});
