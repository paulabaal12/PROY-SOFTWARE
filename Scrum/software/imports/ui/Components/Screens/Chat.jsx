import React, { useState } from 'react';

const Chat = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handler = Meteor.subscribe('messages', chatId);
    const messages = Messages.find({ chatId }).fetch();
    setMessages(messages);

    return () => handler.stop();
  }, [chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      Meteor.call('messages.send', chatId, message, (error) => {
        if (error) {
          console.error('Error al enviar mensaje:', error);
        } else {
          setMessage('');
        }
      });
    }
  };

  return (
    <div className="chat-container">
      <h3>Chat</h3>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.sender}: </strong>
              <span>{msg.content}</span>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

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

