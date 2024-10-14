import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Envios = new Mongo.Collection('envios');

if (Meteor.isServer) {
  Meteor.publish('envios', function () {
    return Envios.find();
  });
}
