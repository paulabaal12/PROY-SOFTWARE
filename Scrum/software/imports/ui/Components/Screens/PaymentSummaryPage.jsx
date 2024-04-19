import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PaymentSummaryPage.css'

const PaymentSummaryPage = () => {
  const navigate = useNavigate();

  const handleConfirmPurchase = () => {
    navigate('/payment-method');
  };
  const cartItems = [
    { id: 1, name: "Producto 1", quantity: 2, price: 15.99 },
    { id: 2, name: "Producto 2", quantity: 1, price: 45.99 },
    { id: 3, name: "Producto 3", quantity: 3, price: 9.99 }
  ];

  const paymentMethod = 'Tarjeta de Crédito';

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.16; // Suponiendo un impuesto del 16%
  const total = subtotal + tax;

  return (
    <div className="payment-summary-page">
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
      <div className="payment-details">
        <p>Método de pago: {paymentMethod}</p>
      </div>
      <div className="totals">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Impuesto: ${tax.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <div className="actions">
        <button onClick={() => console.log("Editar Carrito")}>Editar Carrito</button>
        <button onClick={() => console.log("Editar Método de Pago")}>Editar Método de Pago</button>
        <button onClick={handleConfirmPurchase}>Confirmar Compra</button>
      </div>
    </div>
  );
};

export default PaymentSummaryPage;
