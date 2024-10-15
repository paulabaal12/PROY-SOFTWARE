import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importar estilos

const Envios = new Mongo.Collection('envios'); // Colección de envíos

const DeliveryManagement = () => {
  const [envios, setEnvios] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [cartCount, setCartCount] = useState(0); // Estado del carrito

  // Tracker para obtener datos de la colección
  const enviosData = useTracker(() => {
    Meteor.subscribe('envios');
    return Envios.find().fetch();
  }, []);

  useEffect(() => {
    setEnvios(enviosData);

    // Simular carga del carrito desde localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = storedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, [enviosData]);

  const handleConfirmDelivery = (id) => {
    if (window.confirm('¿Confirmar entrega de este envío?')) {
      // Actualizar estado del envío
      Envios.update(id, { $set: { estado_envio: 'Entregado' } });
      setNotification({ show: true, message: 'Entrega confirmada' });

      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    }
  };

  const handleDeleteDelivery = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este envío?')) {
      Envios.remove(id);
      setEnvios(envios.filter((envio) => envio.id_envio !== id));
      setNotification({ show: true, message: 'Envío eliminado' });

      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    }
  };

  return (
    <div className="containerr">
      <Header cartCount={cartCount} />
      <div className="delivery-page">
        <h1 className="titulo1">Gestión de Entregas</h1>

        {notification.show && (
          <div className="notification">
            <img src={'/images/delivery.png'} alt="Notificación" className="notification-icon" />
            {notification.message}
          </div>
        )}

        {envios.length > 0 ? (
          <ul className="delivery-list">
            {envios.map((envio) => (
              <li key={envio.id_envio} className="delivery-item">
                <div>
                  <p><strong>ID del Envío:</strong> {envio.id_envio}</p>
                  <p><strong>Proveedor:</strong> {envio.proveedor_envio}</p>
                  <p><strong>Número de Rastreo:</strong> {envio.numero_rastreo}</p>
                  <p><strong>Estado:</strong> {envio.estado_envio}</p>
                  <p><strong>Fecha de Envío:</strong> {new Date(envio.fecha_envio).toLocaleString()}</p>
                </div>
                <div className="delivery-actions">
                  <button
                    className="confirm-button"
                    onClick={() => handleConfirmDelivery(envio.id_envio)}
                    disabled={envio.estado_envio === 'Entregado'}
                  >
                    Confirmar Entrega
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteDelivery(envio.id_envio)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay envíos registrados.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryManagement;
