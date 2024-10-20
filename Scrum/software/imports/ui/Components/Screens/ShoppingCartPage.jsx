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
    return savedCartItems
      ? JSON.parse(savedCartItems).map((item) => ({
          ...item,
          price: parseFloat(item.price),
        }))
      : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleChangeQuantity = (itemId, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5;
    const total = subtotal + shipping;
  
    // Aseguramos que los datos se pasen correctamente en la navegación
    navigate('/payment-method', { state: { cartItems, total } });
  };
  

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5; // Asumimos que es gratis
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <div className="cart-container">
        <h1 className="cart-title">Carrito de compras</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => (e.target.src = '/path-to-placeholder-image/placeholder.png')}
              />
              <div className="cart-item-info">
                <h2 className="cart-item-name">{item.name}</h2>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleChangeQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleChangeQuantity(item.id, 1)}>+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="remove-item-button">
                  🗑️ Eliminar
                </button>
              </div>
            </div>            
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen de órden</h2>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Envío: {shipping > 0 ? `$${shipping}` : 'Gratis'}</p>
            <p className="total">Total: ${total.toFixed(2)}</p>
            <button onClick={handleCheckout} className="checkout-button">
              Ir a Pagar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCartPage;
