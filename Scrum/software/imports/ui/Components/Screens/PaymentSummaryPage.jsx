import React from 'react';

const PaymentSummaryPage = ({ transactionId, onConfirmPayment }) => (
  <div className="payment-summary-container">
    <div className="form-container">
      <h1 className="centered">Resumen del Pago</h1>
      <p className="centered">Transacción No. {transactionId}</p>
      <button onClick={onConfirmPayment} className="btn">Confirmar</button>
    </div>
  </div>
);

export default PaymentSummaryPage;