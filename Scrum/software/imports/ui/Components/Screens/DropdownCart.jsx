import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';

const DropdownCart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');

  // Cargar los productos del localStorage al iniciar
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(localStorage.getItem('currency') || 'GTQ');
    };

    window.addEventListener('storage', handleCurrencyChange);
    return () => {
      window.removeEventListener('storage', handleCurrencyChange);
    };
  }, []);

  const convertPrice = (precio) => {
    const numericPrice = parseFloat(precio) || 0; // Asegura que siempre sea un número

    let convertedPrice, symbol;
    switch (currency) {
      case 'USD':
        convertedPrice = (numericPrice / 8).toFixed(2);
        symbol = '$';
        break;
      case 'EUR':
        convertedPrice = (numericPrice / 9).toFixed(2);
        symbol = '€';
        break;
      case 'GBP':
        convertedPrice = (numericPrice / 11).toFixed(2);
        symbol = '£';
        break;
      default:
        convertedPrice = numericPrice.toFixed(2); // Quetzales por defecto
        symbol = 'Q';
    }
    return `${symbol} ${convertedPrice}`;
  };

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

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => 
      total + (parseFloat(item.price) || 0) * item.quantity, 0
    );

  const handleDropdownClick = (event) => {
    event.stopPropagation(); // Evita que se cierre el dropdown al hacer clic dentro.
  };

  return (
    <div className="dropdown-cart" onClick={handleDropdownClick}>
      <div className="dropdown-cart-header">
        <h3 className="product-count">Carrito</h3>
        <p>
          Total productos: <span className="product-count">{getTotalQuantity()}</span>
        </p>
        <p>
          Precio total: <span>{convertPrice(getTotalPrice())}</span>
        </p>
      </div>
      <div className="dropdown-cart-content">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="dropdown-cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="dropdown-cart-item-image"
                onError={(e) => (e.target.src = '/path-to-placeholder-image/placeholder.png')}
              />
              <div className="dropdown-cart-item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">
                  Precio unitario: {convertPrice(item.price || 0)}
                </p>
                <div className="quantity-controls">
                  <button onClick={() => handleChangeQuantity(item.id, -1)}>-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => handleChangeQuantity(item.id, 1)}>+</button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="remove-item-button"
                >
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
