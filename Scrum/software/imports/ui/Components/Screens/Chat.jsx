import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

const Chat = ({ chatId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages when component mounts
  useEffect(() => {
    if (chatId) {
      Meteor.call('chats.getMessages', chatId, (error, result) => {
        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          setMessages(result);
          setIsLoading(false);
        }
      });
    }
  }, [chatId]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const newMessage = {
        chat_id: chatId,
        usuario_id: userId,
        contenido: message,
      };

      Meteor.call('chats.sendMessage', newMessage.chat_id, newMessage.usuario_id, newMessage.contenido, (error, messageId) => {
        if (error) {
          console.error('Error sending message:', error);
        } else {
          const timestamp = new Date().toLocaleTimeString();
          const sentMessage = {
            id: messageId,
            sender: 'Tú',
            content: newMessage.contenido,
            timestamp,
          };
          setMessages([...messages, sentMessage]);
          setMessage(''); // Clear input
        }
      });
    }
  };

  return (
    <div className="chat-container">
      <h3>Chat</h3>
      {isLoading ? (
        <p>Cargando mensajes...</p>
      ) : (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <strong>{msg.sender || 'Usuario'}: </strong>
                <span>{msg.content}</span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;

