import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const PedidosPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [pedidosUsuario, setPedidosUsuario] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userId = parseInt(localStorage.getItem('userId'), 10);
  console.log("User ID en PedidosPage:", userId);

  useEffect(() => {
    if (userId) {
      Meteor.call('pedidos.getByUser', userId, (error, result) => {
        if (error) {
          console.error('Error al obtener los pedidos:', error);
        } else {
          console.log('Pedidos obtenidos del usuario:', result);
          setPedidosUsuario(result);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const handleVerDetalles = (pedido) => {
    try {
      // Verificamos si los detalles ya son un objeto o si vienen como cadena
      const detalles = typeof pedido.detalles === 'string' 
        ? JSON.parse(pedido.detalles) 
        : pedido.detalles;
  
      setSelectedPedido({ ...pedido, detalles });
      setModalVisible(true);
    } catch (error) {
      console.error("Error al parsear los detalles del pedido:", error);
    }
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="container3">
      <Header cartCount={cartCount} />
      <main className="pedidos-container">
        <h1>Tus Pedidos</h1>
        {pedidosUsuario.length > 0 ? (
          <ul className="pedido-list">
            {pedidosUsuario.map((pedido) => (
              <li key={pedido.id_pedido} className="pedido-card">
                <div className="pedido-header">
                  <h4>Pedido #{pedido.id_pedido}</h4>
                  <p>Estado: {pedido.estado}</p>
                  <p>Total: Q{Number(pedido.total).toFixed(2)}</p>
                  <p>Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
                  <button
                    className="ver-detalles-button"
                    onClick={() => handleVerDetalles(pedido)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes pedidos aún.</p>
        )}
      </main>

      {modalVisible && selectedPedido && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Pedido #{selectedPedido.id_pedido}</h2>
            <p>Estado: {selectedPedido.estado}</p>
            <p>Total: Q{Number(selectedPedido.total).toFixed(2)}</p>
            <p>Fecha: {new Date(selectedPedido.fecha).toLocaleString()}</p>
            <h3>Productos:</h3>
            <ul>
              {selectedPedido.detalles.map((producto, index) => (
                <li key={index}>
                  Producto ID: {producto.producto_id}, 
                  Cantidad: {producto.cantidad}, 
                  Precio: Q{producto.precio_unitario}
                </li>
              ))}
            </ul>
            <button className="cerrar-modal-button" onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PedidosPage;
