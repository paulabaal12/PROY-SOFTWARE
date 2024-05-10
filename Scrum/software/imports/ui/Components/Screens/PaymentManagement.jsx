import React from 'react';
import { Link } from 'react-router-dom';
import './css/PaymentManagement.css';

const PaymentManagement = () => {
  return (
    <div className="payment-management-page">
      <h1>Payment Management</h1>
      <Link to="/transaction-summary" className="section-link">
        <div className="transaction-summary">
          <h2>Resumen de transacciones</h2>
        </div>
      </Link>
      <Link to="/transaction-history" className="section-link">
        <div className="transaction-history">
          <h2>Historial de transacciones</h2>
        </div>
      </Link>
      <Link to="/transaction-actions" className="section-link">
        <div className="transaction-actions">
          <h2>Acciones de transacción</h2>
        </div>
      </Link>
    </div>
  );
};

export default PaymentManagement;

