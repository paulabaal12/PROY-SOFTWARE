import { Mongo } from 'meteor/mongo';
import  SimpleSchema  from 'simpl-schema';
// Se definen coleciones que son equivalentes a tablas, para almacenar la info de c/u
export const Chats = new Mongo.Collection('chats');
export const Messages = new Mongo.Collection('messages');

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

