import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importar estilos

const Productos = new Mongo.Collection('productos'); // Colección de productos

const InventoryManagement = () => {
  const [productos, setProductos] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Estado del carrito
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Obtener productos desde la colección usando Tracker
  const productosData = useTracker(() => {
    Meteor.subscribe('productos');
    return Productos.find().fetch();
  }, []);

  useEffect(() => {
    setProductos(productosData);

    // Simulamos la carga del número de productos en el carrito
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = storedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, [productosData]);

  const handleAddToCart = (producto) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find((item) => item.id === producto.id);

    if (existingProduct) {
      cartItems = cartItems.map((item) =>
        item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cartItems.push({ ...producto, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });

    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      Productos.remove(id);
      setProductos(productos.filter((producto) => producto.id !== id));
      setNotification({ show: true, message: 'Producto eliminado' });

      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    }
  };

  return (
    <div className="containerr">
      <Header cartCount={cartCount} />
      <div className="inventory-page">
        <h1 className="titulo1">Gestión de Inventario</h1>

        {notification.show && (
          <div className="notification">
            <img src={'/images/carrito.png'} alt="Notificación" className="notification-icon" />
            {notification.message}
          </div>
        )}

        <button className="add-button">Añadir Nuevo Producto</button>

        {productos.length > 0 ? (
          <div className="inventory-list">
            {productos.map((producto) => (
              <div key={producto.id} className="inventory-item">
                <div className="product-details">
                  <img
                    src={producto.imagen_principal || '/images/placeholder.png'}
                    alt={producto.nombre}
                    className="product-image"
                  />
                  <div>
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-price">Q{producto.precio.toFixed(2)}</p>
                    <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                    <p className="product-status"><strong>Estado:</strong> {producto.estado}</p>
                  </div>
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
                  <button
                    className="button-add"
                    onClick={() => handleAddToCart(producto)}
                  >
                    Añadir al Carrito
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
