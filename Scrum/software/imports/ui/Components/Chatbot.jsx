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
  
    const chatBodyRef = useRef(null);
  
    const faqAnswers = {
      '¿Cómo puedo comprar?': {
        text: 'Ingresa al catálogo, elige los productos que deseas y agrégalos al carrito.',
        next: ['¿Cuáles son los métodos de pago?', '¿Cuál es el tiempo de entrega?', 'Más preguntas']
      },
      '¿Cuáles son los métodos de pago?': {
        text: 'Aceptamos PayPal, Transferencia bancaria y Pago contra entrega.',
        next: ['¿Puedo cancelar mi pedido?', '¿Qué productos tienen en descuento?', 'Más preguntas']
      },
      '¿Cuál es el tiempo de entrega?': {
        text: 'El tiempo de entrega varía según tu ubicación, pero generalmente es de 2 a 5 días hábiles.',
        next: ['¿Cómo rastreo mi pedido?', '¿Puedo programar la entrega de mi pedido?', 'Más preguntas']
      },
      '¿Cómo rastreo mi pedido?': {
        text: 'Te enviaremos un correo con el enlace para rastrear tu pedido una vez despachado.',
        next: ['¿Cómo contacto al repartidor?', '¿Dónde puedo ver mis facturas?', 'Más preguntas']
      },
      '¿Puedo cancelar mi pedido?': {
        text: 'Sí, puedes cancelarlo desde tu perfil antes de que sea despachado.',
        next: ['¿Cómo puedo hacer una devolución?', '¿Cómo aplico un cupón de descuento?', 'Más preguntas']
      },
      '¿Cómo contacto al repartidor?': {
        text: 'Puedes comunicarte directamente con el repartidor desde la sección de pedidos.',
        next: ['¿Qué pasa si no estoy en casa para recibir mi pedido?', '¿Puedo cambiar la dirección de entrega?', 'Más preguntas']
      },
      '¿Dónde puedo ver mis facturas?': {
        text: 'Puedes descargar tus facturas desde la sección de "Historial de Pedidos".',
        next: ['¿Cuál es la política de devoluciones?', '¿Tienen un programa de lealtad?', 'Más preguntas']
      },
      '¿Qué productos tienen en descuento?': {
        text: 'Los productos en descuento se encuentran destacados en la sección de "Ofertas".',
        next: ['¿Ofrecen envíos internacionales?', '¿Tienen una tienda física?', 'Más preguntas']
      },
      '¿Cómo puedo hacer una devolución?': {
        text: 'Puedes iniciar una devolución desde la sección de pedidos. Te explicaremos los pasos.',
        next: ['¿Puedo cambiar la dirección de entrega?', '¿Tienen servicio al cliente?', 'Más preguntas']
      },
      '¿Puedo cambiar la dirección de entrega?': {
        text: 'Sí, puedes hacerlo desde tu perfil antes de que el pedido sea despachado.',
        next: ['¿Puedo programar la entrega de mi pedido?', '¿Qué pasa si no estoy en casa?', 'Más preguntas']
      },
      '¿Qué pasa si no estoy en casa para recibir mi pedido?': {
        text: 'El repartidor intentará nuevamente al día siguiente o te contactará para coordinar.',
        next: ['¿Cómo configuro mis notificaciones?', '¿Tienen un programa de lealtad?', 'Más preguntas']
      },
      '¿Cómo configuro mis notificaciones?': {
        text: 'Puedes personalizar las notificaciones desde la sección de configuración en tu perfil.',
        next: ['¿Cuál es la política de devoluciones?', '¿Ofrecen envíos internacionales?', 'Más preguntas']
      },
      '¿Cuál es la política de devoluciones?': {
        text: 'Tienes 30 días para devolver productos, siempre que estén en perfecto estado.',
        next: ['¿Tienen un programa de lealtad?', '¿Ofrecen envíos internacionales?', 'Más preguntas']
      },
      '¿Cómo aplico un cupón de descuento?': {
        text: 'Ingresa el código del cupón en la pantalla de pago para aplicar el descuento.',
        next: ['¿Tienen un programa de lealtad?', '¿Tienen servicio al cliente?', 'Más preguntas']
      },
      '¿Ofrecen envíos internacionales?': {
        text: 'Actualmente solo realizamos envíos nacionales dentro de Guatemala.',
        next: ['¿Tienen una tienda física?', '¿Puedo programar la entrega?', 'Más preguntas']
      },
      '¿Tienen una tienda física?': {
        text: 'Por ahora solo operamos en línea, pero planeamos abrir tiendas físicas pronto.',
        next: ['¿Tienen un programa de lealtad?', 'Más preguntas']
      },
      '¿Puedo programar la entrega de mi pedido?': {
        text: 'Sí, puedes seleccionar la fecha de entrega durante el proceso de compra.',
        next: ['¿Tienen servicio al cliente?', 'Más preguntas']
      },
      '¿Tienen un programa de lealtad?': {
        text: 'Sí, por cada compra acumulas puntos que puedes canjear por descuentos.',
        next: ['¿Cómo configuro mis notificaciones?', 'Más preguntas']
      },
      'Más preguntas': {
        text: '¿En qué más puedo ayudarte?',
        next: ['¿Cómo puedo comprar?', '¿Cuáles son los métodos de pago?', 'Más preguntas']
      }
    };
  
    useEffect(() => {
      setQuickReplies(['¿Cómo puedo comprar?', '¿Cuáles son los métodos de pago?', 'Más preguntas']);
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
  
      const response = faqAnswers[message] || { text: 'Lo siento, no tengo una respuesta para eso. El chat será transferido a uno de nuestros asesores.', next: [] };
  
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: response.text }
        ]);
        setIsTyping(false);
        const limitedReplies = response.next.slice(0, 3); // Limitar a 3 respuestas
        setQuickReplies(limitedReplies.length > 0 ? limitedReplies : ['Más preguntas']);
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
  