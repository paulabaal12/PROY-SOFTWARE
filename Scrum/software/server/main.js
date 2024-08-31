import { Meteor } from 'meteor/meteor';
import { transporter } from './config/email';
import { pool } from './db/postgres';
import './methods/users';
import './methods/products';
import './methods/sales';
import './methods/orders';

Meteor.startup(() => {
  // Configuración inicial del servidor
  console.log('Servidor iniciado');

  // Verificar conexión a PostgreSQL
  pool.connect((err) => {
    if (err) {
      console.error('Error de conexión a PostgreSQL:', err);
    } else {
      console.log('Conexión exitosa a PostgreSQL');
    }
  });

  // Verificar configuración del servicio de email
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error en la configuración del servicio de email:', error);
    } else {
      console.log('Servicio de email configurado correctamente');
    }
  });

  // Imprimir en qué puerto está corriendo el proyecto
  const port = process.env.PORT || 3000;
  console.log(`El proyecto está corriendo en el puerto ${port}`);
});