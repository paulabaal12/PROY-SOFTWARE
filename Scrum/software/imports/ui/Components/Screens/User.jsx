import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './style.css';

const User = () => {
  const navigate = useNavigate();

  const handlePaymentManagement = () => {
    navigate('/user/paymentmanagement');
  };

  const handleInventoryManagement = () => {
    navigate('/user/inventorymanagement');  
  };

  const handleDeliveryManagement = () => {
    navigate('/user/deliverymanagement');
  };

  return (
    <div className="container user-page">
      <Header />
      <div className="user-interface">
        <div className="user-header">
          <h2>Usuario</h2>
          <Link to="/homepage" className="back-button">
            <i className="arrow"></i> Volver
          </Link>
        </div>
        <div className="user-menu">
          <div className="action-container">
            <div className="payment-button">
              <button onClick={handlePaymentManagement}>Gestión de Pagos</button>
              <button onClick={handleInventoryManagement}>Gestión de Inventario</button>
              <button onClick={handleDeliveryManagement}>Gestión de Repartidor</button>
            </div>
          </div>
          <div className="delivery-container"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default User;
