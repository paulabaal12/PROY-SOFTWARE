import { Mongo } from 'meteor/mongo';
import  SimpleSchema  from 'simpl-schema';
// Se definen coleciones que son equivalentes a tablas, para almacenar la info de c/u
export const Chats = new Mongo.Collection('chats');
export const Messages = new Mongo.Collection('messages');
export const Feedback = new Mongo.Collection('feedback');
export const OrderTracking = new Mongo.Collection('orderTracking');

// Se define el esquema de cada coleccion
Chats.schema = new SimpleSchema({
	participants: {type:Array},
	'participants.$':{type:String},
	createdAt:{type:Date,defaultValue: new Date()},
});

Messages.schema = new SimpleSchema({
	chatId: {type:String},
	userName: {type:String},
	text: {type:String},
	createdAt: {type:Date,defaultValue:new Date()},
});

Feedback.schema = new SimpleSchema({
  orderId: { type: String },
  userId: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  comments: { type: String, optional: true },
  createdAt: { type: Date, defaultValue: new Date() },
});

OrderTracking.schema = new SimpleSchema({
  orderId: { type: String },
  driverId: { type: String },
  currentLocation: { type: Object, blackbox: true },
  status: { type: String },
  estimatedDeliveryTime: { type: Date, optional: true },
  lastUpdated: { type: Date, defaultValue: new Date() },
});
