import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Asegúrate de importar tus estilos

const Ventas = new Mongo.Collection('ventas');

const PaymentManagement = () => {
  const [ventas, setVentas] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Definimos cartCount aquí

  const ventasData = useTracker(() => {
    Meteor.subscribe('ventas');
    return Ventas.find().fetch();
  }, []);

  useEffect(() => {
    setVentas(ventasData);
    
    // Simulamos un valor del carrito para pruebas
    const carritoPrueba = 3; // Valor de ejemplo
    setCartCount(carritoPrueba);
  }, [ventasData]);

  return (
    <div className="containerr">
      <Header cartCount={0} /> {/* cartCount ahora está definido */}
      <div className="container payment-management-page">
        <h1 className="titulo1">Gestión de Pagos</h1>
        {ventas.length > 0 ? (
          <ul className="inventory-list">
            {ventas.map((venta) => (
              <li key={venta.id_venta} className="inventory-item">
                <div>
                  <p><strong>Vendedor ID:</strong> {venta.vendedor_id}</p>
                  <p><strong>Monto:</strong> Q{venta.monto.toFixed(2)}</p>
                  <p><strong>Medio de Pago:</strong> {venta.medio_pago}</p>
                  <p><strong>Estado:</strong> {venta.estado}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay pagos registrados.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentManagement;
