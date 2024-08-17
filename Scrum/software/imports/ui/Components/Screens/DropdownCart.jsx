import React from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';

const DropdownCart = ({ cartItems, onClose }) => {
  return (
    <div className="dropdown-cart">
      <div className="dropdown-cart-content">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="dropdown-cart-item">
              <img src={item.image} alt={item.name} className="dropdown-cart-item-image" />
              <div className="dropdown-cart-item-details">
                <p>{item.name}</p>
                <p>Cantidad: {item.quantity}</p>
                <p>Precio: ${item.price.toFixed(2)}</p>
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
