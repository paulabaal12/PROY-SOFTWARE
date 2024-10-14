import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Ventas = new Mongo.Collection('ventas');

if (Meteor.isServer) {
  Meteor.publish('ventas', function () {
    return Ventas.find();
  });
}
