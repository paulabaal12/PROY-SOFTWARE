import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const PaymentSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };

  const handleConfirmPurchase = () => {
    navigate('/payment-method', { state: { total, cartItems } });
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal;

  return (
    <>
      <div className="containerr">
        <Header />
      </div>
      <div className="container payment-summary-page">
        <h1>Resumen de Pago</h1>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>Cantidad: {item.quantity}</span>
              <span>Precio: ${item.price.toFixed(2)}</span>
              <span>Subtotal: ${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="totals">
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <div className="actions">
          <button onClick={() => navigate('/cart')}>Editar Carrito</button>
          <button onClick={handleConfirmPurchase}>Continuar con el pago</button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PaymentSummaryPage;
