// PedidosPage.jsx
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Pedidos } from '../../../api/pedidos';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const PedidosPage = () => {
  const userId = localStorage.getItem('userId'); // Obtener ID del usuario logueado
  const [cartCount, setCartCount] = useState(0);

  // Obtener los pedidos del usuario logueado
  const pedidosUsuario = useTracker(() => {
    if (userId) {
      Meteor.subscribe('pedidosUsuario', userId);
      return Pedidos.find({ usuario_id: parseInt(userId) }).fetch();
    }
    return [];
  }, [userId]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  return (
    <div className="container3">
      <Header cartCount={cartCount} />
      <main>
        <h1>Tus Pedidos</h1>
        {pedidosUsuario.length > 0 ? (
          <ul className="pedido-list">
            {pedidosUsuario.map((pedido) => (
              <li key={pedido.id_pedido}>
                <h3>Pedido #{pedido.id_pedido}</h3>
                <p>Estado: {pedido.estado}</p>
                <p>Total: Q{pedido.total}</p>
                <p>Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes pedidos aún.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PedidosPage;
