import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems).map(item => ({
      ...item,
      price: parseFloat(item.price)  // Ensure price is a float
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (itemId) => {
    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleChangeQuantity = (itemId, delta) => {
    const newCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleCheckout = () => {
    navigate('/payment-summary', { state: { cartItems } });
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <>
      <div className="containerr">
        <Header />
      </div>
      <div className="container1 shopping-cart">
        <h1>Carrito de Compras</h1>
        <div className="cart-items-container">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name} 
                className="cart-item-image" 
                onError={(e) => e.target.src = '/path-to-placeholder-image/placeholder.png'} 
              />

              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <div className="cart-item-quantity">
                  <button onClick={() => handleChangeQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleChangeQuantity(item.id, 1)}>+</button>
                </div>
                <p className="cart-item-price">Precio: ${item.price.toFixed(2)}</p>
                <p className="cart-item-total">Total: ${(item.quantity * item.price).toFixed(2)}</p>
                <button onClick={() => handleRemove(item.id)} className="remove-button">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout">
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={handleCheckout} className="checkout-button">Proceder al Pago</button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ShoppingCartPage;
