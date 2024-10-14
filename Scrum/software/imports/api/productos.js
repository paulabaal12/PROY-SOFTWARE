import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Productos = new Mongo.Collection('productos');

if (Meteor.isServer) {
  Meteor.publish('productos', function () {
    return Productos.find();
  });
}
