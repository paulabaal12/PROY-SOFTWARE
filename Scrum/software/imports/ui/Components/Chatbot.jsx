import React, { useState, useEffect, useRef } from 'react';
import '../style.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);

  const faqAnswers = {
    '¿Cómo puedo comprar?': 'Ingresa al catálogo, elige los productos que deseas y agrégalos al carrito.',
    '¿Cuáles son los métodos de pago?': 'Aceptamos PayPal, Transferencia bancaria y Pago contra entrega.',
    '¿Cómo elimino productos?': 'Desde la sección de Inventario, selecciona el producto y elige la opción eliminar.',
    '¿Cuál es el tiempo de entrega?': 'El tiempo de entrega varía según tu ubicación, pero generalmente es de 2 a 5 días hábiles.',
    '¿Cómo rastreo mi pedido?': 'Te enviaremos un correo con el enlace para rastrear tu pedido una vez despachado.',
    '¿Puedo cancelar mi pedido?': 'Sí, puedes cancelarlo desde tu perfil antes de que sea despachado.',
    '¿Tienen servicio al cliente?': 'Sí, nuestro soporte está disponible las 24 horas a través del chat y correo electrónico.',
    '¿Cómo contacto al repartidor?': 'Puedes comunicarte directamente con el repartidor desde la sección de pedidos.',
    '¿Dónde puedo ver mis facturas?': 'Puedes descargar tus facturas desde la sección de "Historial de Pedidos".',
    '¿Qué productos tienen en descuento?': 'Los productos en descuento se encuentran destacados en la sección de "Ofertas".',
    '¿Cómo puedo hacer una devolución?': 'Puedes iniciar una devolución desde la sección de pedidos. Te explicaremos los pasos.',
    '¿Puedo cambiar la dirección de entrega?': 'Sí, puedes hacerlo desde tu perfil antes de que el pedido sea despachado.',
    '¿Qué pasa si no estoy en casa para recibir mi pedido?': 'El repartidor intentará nuevamente al día siguiente o te contactará para coordinar.',
    '¿Cómo configuro mis notificaciones?': 'Puedes personalizar las notificaciones desde la sección de configuración en tu perfil.',
    '¿Cuál es la política de devoluciones?': 'Tienes 30 días para devolver productos, siempre que estén en perfecto estado.',
    '¿Cómo aplico un cupón de descuento?': 'Ingresa el código del cupón en la pantalla de pago para aplicar el descuento.',
    '¿Ofrecen envíos internacionales?': 'Actualmente solo realizamos envíos nacionales dentro de Guatemala.',
    '¿Tienen una tienda física?': 'Por ahora solo operamos en línea, pero planeamos abrir tiendas físicas pronto.',
    '¿Puedo programar la entrega de mi pedido?': 'Sí, puedes seleccionar la fecha de entrega durante el proceso de compra.',
    '¿Tienen un programa de lealtad?': 'Sí, por cada compra acumulas puntos que puedes canjear por descuentos.'
  };

  const chatBodyRef = useRef(null);

  useEffect(() => {
    setQuickReplies([
      '¿Cómo puedo comprar?', 
      '¿Cuáles son los métodos de pago?', 
      '¿Cuál es el tiempo de entrega?', 
      '¿Puedo cancelar mi pedido?', 
      '¿Cómo rastreo mi pedido?', 
      'Más preguntas'
    ]);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = (message) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages(newMessages);
    setIsTyping(true);

    const botResponse = faqAnswers[message] || 'Lo siento, no tengo una respuesta para eso.';

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botResponse }
      ]);
      setIsTyping(false);
    }, 1000);

    setUserMessage('');
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chat-icon" onClick={toggleChat}>
        <img src="/images/chat-icon.png" alt="Chatbot Icon" />
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <img src="/images/chat-icon.png" alt="B.O.B" className="chatbot-logo" />
            <h3>B.O.B</h3>
            <button onClick={toggleChat} className="close-button">X</button>
          </div>

          <div className="chat-messages" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="typing-indicator">B.O.B está escribiendo...</div>}
          </div>

          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => sendMessage(reply)}
                className="quick-reply-button"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(userMessage)}
            />
            <button onClick={() => sendMessage(userMessage)}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
