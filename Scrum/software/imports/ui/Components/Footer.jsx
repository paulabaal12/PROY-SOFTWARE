import React from 'react';
import '../style.css';
import '../variables.css';
import Chatbot from './Chatbot';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024. Todos los derechos reservados.</p>
      <Chatbot />
    </footer>
  );
};

export default Footer;