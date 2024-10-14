import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

export const Pedidos = new Mongo.Collection('pedidos');

if (Meteor.isServer) {
  Meteor.publish('pedidosUsuario', function (userId) {
    check(userId, String);
    return Pedidos.find({ usuario_id: parseInt(userId) });
  });
}
