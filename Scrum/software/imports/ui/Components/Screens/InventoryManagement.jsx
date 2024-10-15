import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Asegúrate de usar el CSS actualizado

const InventoryManagement = () => {
  const [productos, setProductos] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const usuarioId = 1; // Cambia esto según tu autenticación

  useEffect(() => {
    fetchUserProductos(); // Cargar productos del usuario al montar el componente
  }, []);

  const fetchUserProductos = () => {
    Meteor.call('productos.getByUser', usuarioId, (err, result) => {
      if (err) {
        console.error('Error al obtener productos del usuario:', err);
      } else {
        console.log('Productos del usuario obtenidos:', result);
        setProductos(result);
      }
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      Meteor.call('productos.delete', id, (err) => {
        if (err) {
          console.error('Error al eliminar producto:', err);
        } else {
          setNotification({ show: true, message: 'Producto eliminado' });
          setTimeout(() => setNotification({ show: false, message: '' }), 3000);
          fetchUserProductos(); // Refresca la lista después de eliminar
        }
      });
    }
  };

  return (
    <div className="containerr">
      <Header cartCount={0} />
      <div className="inventory-page">
        <h1 className="titulo1">Gestión de Inventario</h1>

        {notification.show && (
          <div className="notification">
            <img src={'/images/carrito.png'} alt="Notificación" className="notification-icon" />
            {notification.message}
          </div>
        )}

        <button
          className="add-button"
          onClick={() => alert('Funcionalidad de añadir producto no implementada aún')}
        >
          Añadir Nuevo Producto
        </button>

        {productos.length > 0 ? (
          <div className="inventory-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="inventory-card">
                <img
                  src={producto.imagen_principal || '/images/placeholder.png'}
                  alt={producto.nombre}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{producto.nombre}</h3>
                  <p className="product-price">
                    Q{(typeof producto.precio === 'number' ? producto.precio.toFixed(2) : '0.00')}
                  </p>
                  <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                  <p className="product-status"><strong>Estado:</strong> {producto.estado}</p>
                </div>
                <div className="product-actions">
                  <button
                    className="edit-button"
                    onClick={() => alert(`Editar producto: ${producto.nombre}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteProduct(producto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos en el inventario.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InventoryManagement;
