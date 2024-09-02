import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const OrderTracking = new Mongo.Collection('orderTracking');

OrderTracking.schema = new SimpleSchema({
  orderId: { type: String },
  driverId: { type: String },
  currentLocation: { type: Object, blackbox: true },
  status: { type: String },
  estimatedDeliveryTime: { type: Date, optional: true },
  lastUpdated: { type: Date, defaultValue: new Date() },
});

OrderTracking.attachSchema(OrderTracking.schema);