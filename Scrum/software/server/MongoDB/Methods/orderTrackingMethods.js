// MongoDB/orderTrackingMethods.js

import { Meteor } from 'meteor/meteor';
import { OrderTracking } from './orderTracking';
import { pool } from '../PostgreSQL/db/postgres';

Meteor.methods({
  'orderTracking.syncWithPostgres'(orderId) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM pedidos WHERE id = $1', [orderId], (err, result) => {
        if (err) {
          console.error('Error fetching order from PostgreSQL:', err);
          reject(new Meteor.Error('database-error', 'Error fetching order from PostgreSQL'));
        } else {
          const orderData = result.rows[0];
          // Insert or update the tracking information in MongoDB
          OrderTracking.upsert({ orderId: orderData.id }, {
            $set: {
              driverId: orderData.assigned_driver,
              status: orderData.status,
              lastUpdated: new Date(),
            },
          });
          resolve('Order tracking updated');
        }
      });
    });
  },

  'orderTracking.updateStatus'(orderId, status) {
    return OrderTracking.update({ orderId }, { $set: { status, lastUpdated: new Date() } });
  },

  'orderTracking.updateLocation'(orderId, location) {
    return OrderTracking.update({ orderId }, { $set: { currentLocation: location, lastUpdated: new Date() } });
  },
});
