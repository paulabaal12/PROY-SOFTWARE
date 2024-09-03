import { Meteor } from 'meteor/meteor';
import { transporter } from './config/email';
import pool from './PostgreSQL/db/conn.js';
import './methods/users';
import './methods/products';
import './methods/sales';
import './methods/orders';
import '../server/MongoDB/orderTracking';
import '../server/MongoDB/feedback';
import '../server/MongoDB/Methods/orderTrackingMethods';
import '../server/MongoDB/Methods/feedbackMethods';
import '../server/MongoDB/chat';
import '../server/MongoDB/collections';



Meteor.startup(() => {
  // Configuración inicial del servidor
  console.log('Servidor iniciado');


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
