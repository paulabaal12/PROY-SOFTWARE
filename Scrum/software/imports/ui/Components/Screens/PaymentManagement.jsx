import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../../../ui/style.css';

const PaymentManagement = () => {
  return (
    <div className="container payment-management-page">
      <Header />
      <h1>Gestión de Pagos</h1>
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
      <Footer />
    </div>
  );
};

export default PaymentManagement;

