import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; 
import '../../variables.css';

const User = ({ onLogout }) => {
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

  const handleLogout = () => {
    onLogout(); 
    navigate('/login'); 
  };

  const handleBack = () => {
    navigate('/homepage');
  };

  return (
    <>
      <div className="containerr">
        <Header />
      </div>
      <div className="container user-page">
        <div className="user-interface">
          <div className="user-header">
            <div className="back-button-container">
              <button className="back-button" onClick={handleBack}>
                &#8249; Volver
              </button>
            </div>
            <h2>Usuario</h2>
          </div>
          <div className="user-menu">
            <div className="action-container">
              <div className="payment-button">
                <div className="button-container">
                  <img src="/images/pagos.png" alt="Gestión de Pagos" className="uniform-image" />
                  <button onClick={handlePaymentManagement}>Gestión de Pagos</button>
                </div>
                <div className="button-container">
                  <img src="/images/inventario.png" alt="Gestión de Inventario" className="uniform-image" />
                  <button onClick={handleInventoryManagement}>Gestión de Inventario</button>
                </div>
                <div className="button-container">
                  <img src="/images/repartidor.png" alt="Gestión de Repartidor" className="uniform-image" />
                  <button onClick={handleDeliveryManagement}>Gestión de Repartidor</button>
                </div>
              </div>
            </div>
          </div>
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default User;
