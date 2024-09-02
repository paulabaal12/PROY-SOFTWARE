import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from './collections';

Meteor.methods({
	// Metodo para crear un nuevo chat
	'chats.create'(participantNames) {
		return Chats.insert({participants: participantNames, createdAt: new Date()});
	},
	// Metodo para enviar mensajes en el chat
	'messages.send'(chatId,text){
		const userName = Meteor.user().username;
		if (!userName) {
			throw new Meteor.Error('Usuario no autorizado');
		}
		return Messages.insert({chatId, userName, text, createdAt:new Date()});
	},
});

// Funciones de meteor para publicar los mensajes y que los clientes puedan ver los datos del chat
if (Meteor.isServer) {
	Meteor.publish('chats', function() {
		return Chats.find({participants: this.user().username});
	});
	Meteor.publish('messages', function(chatId) {
		return Messages.find({chatId});
	});
}
