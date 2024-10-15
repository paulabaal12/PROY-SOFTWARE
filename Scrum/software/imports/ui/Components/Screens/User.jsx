import React, { useEffect, useState } from 'react'; // Asegúrate de importar useEffect
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const User = ({ onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [error, setError] = useState(null); // Estado para manejar errores

  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario

  useEffect(() => {
    if (!userId) {
      console.warn('No se encontró un ID de usuario. Redirigiendo al login.');
      navigate('/login'); // Redirigir si no hay ID
    } else {
      fetchProducts(); // Si hay ID, carga los productos
    }
  }, [userId]);

  // Definición de la función fetchProducts para obtener los productos
  const fetchProducts = () => {
    console.log(`Obteniendo productos para el usuario con ID: ${userId}`);
    Meteor.call('productos.getByUser', parseInt(userId), (err, res) => {
      if (err) {
        console.error('Error al obtener productos:', err);
        setError(`Error al obtener productos: ${err.reason || err.message}`);
      } else {
        console.log('Productos obtenidos:', res);
        setProducts(res || []); // Actualiza el estado con los productos
      }
    });
  };

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
    localStorage.removeItem('userId'); // Limpia el ID de usuario al cerrar sesión
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
          {error && <div className="error-message">{error}</div>}
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
