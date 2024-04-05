import React from 'react';

const PaymentMethodPage = ({ onPaymentSelection, onPay }) => (
  <div className="payment-method-container">
    <div className="form-container">
      <h1 className="centered">Método de Pago</h1>
      {/* Aquí iría el código para seleccionar el método de pago */}
      <button onClick={() => onPaymentSelection('Tarjeta')} className="btn">Tarjeta</button>
      <button onClick={() => onPaymentSelection('Paypal')} className="btn">PayPal</button>
      <button onClick={onPay} className="btn">Pagar</button>
    </div>
  </div>
);

export default PaymentMethodPage;
