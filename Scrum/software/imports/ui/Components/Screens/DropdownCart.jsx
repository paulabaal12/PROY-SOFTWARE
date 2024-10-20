import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';

const DropdownCart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar los productos del localStorage al iniciar
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  // Actualiza el estado y localStorage con los nuevos datos del carrito
  const updateCartItems = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const handleChangeQuantity = (itemId, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    updateCartItems(updatedCart);
  };

  const handleRemove = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    updateCartItems(updatedCart);
  };

  const getTotalQuantity = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleDropdownClick = (event) => {
    event.stopPropagation(); // Detener cierre del dropdown al hacer clic dentro.
  };

  return (
    <div className="dropdown-cart" onClick={handleDropdownClick}>
      <div className="dropdown-cart-header">
        <h3 className="product-count">Carrito</h3>
        <p>Total productos: <span className="product-count">{getTotalQuantity()}</span></p>
      </div>
      <div className="dropdown-cart-content">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="dropdown-cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="dropdown-cart-item-image"
                onError={(e) => (e.target.src = '/path-to-placeholder-image/placeholder.png')}
              />
              <div className="dropdown-cart-item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">Precio: ${item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleChangeQuantity(item.id, -1)}>-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => handleChangeQuantity(item.id, 1)}>+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="remove-item-button">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>El carrito está vacío</p>
        )}
        <Link to="/cart" className="dropdown-cart-button" onClick={onClose}>
          Ver carrito completo
        </Link>
      </div>
    </div>
  );
};

export default DropdownCart;
