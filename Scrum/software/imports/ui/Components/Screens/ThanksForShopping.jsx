import React from 'react';
import { Link } from 'react-router-dom';
import './css/ThanksForShopping.css';
import Header from '../../Header';
import Footer from '../../Footer';


const ThankYouPage = () => {
  return (
    <div className="thank-you-page">
      <Header />
      <br /><br /><br /><br />
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

export default ThankYouPage;
