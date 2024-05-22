import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const ThanksForShopping = () => {
  return (
    <div className="container thank-you-page">
      <Header />
      <h1>¡Gracias por su compra!</h1>
      <p>Su pedido ha sido recibido y estamos procesándolo.</p>
      <p>Puede revisar sus pedidos en la sección <Link to="/pedidos">Pedidos</Link>.</p>
      <div className="thank-you-actions">
        <Link to="/" className="button2">Volver a la Página Principal</Link>
        <Link to="/productos" className="button2">Seguir Comprando</Link>
      </div>
      <Footer />
    </div>
  );
};

export default ThanksForShopping;
