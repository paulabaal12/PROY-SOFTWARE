import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { transporter } from './config/email';
import pool from './PostgreSQL/db/conn.js';
import './methods/users';
import './methods/products';
import './methods/sales';
import './methods/orders';
import '../server/MongoDB/Methods/orderTrackingMethods';
import '../server/MongoDB/Methods/feedbackMethods';
import '../server/MongoDB/chat';
import '../server/MongoDB/collections';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

Meteor.startup(() => {

  const clientId = 'ID';
  const secret = 'SECRET';

  console.log('Client ID:', clientId);
  console.log('Client Secret:', secret);

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

  // Para Login con Google
  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        clientId: clientId,
        secret: secret,
        loginStyle: 'popup', // Cambiar a 'redirect' si el popup falla
      },
    }
  );
  
  WebApp.rawConnectHandlers.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Añadir esto
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir accesos desde cualquier origen
    next();
  });
  

  

  // Imprimir en qué puerto está corriendo el proyecto
  const port = process.env.PORT || 3000;
  console.log(`El proyecto está corriendo en el puerto ${port}`);
});
