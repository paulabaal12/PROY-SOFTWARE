import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); 

  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [cartCount, setCartCount] = useState(cartItems.reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency); // Guarda la moneda seleccionada
  };

  const convertPrice = (precio) => {
    if (isNaN(precio)) {
      console.warn(`Precio inválido: ${precio}`);
      precio = 0;
    }

    let convertedPrice, symbol;
    switch (currency) {
      case 'USD':
        convertedPrice = (precio / 8).toFixed(2);
        symbol = '$';
        break;
      case 'EUR':
        convertedPrice = (precio / 9).toFixed(2);
        symbol = '€';
        break;
      case 'GBP':
        convertedPrice = (precio / 11).toFixed(2);
        symbol = '£';
        break;
      default:
        convertedPrice = precio.toFixed(2);
        symbol = 'Q';
    }

    return `${symbol} ${convertedPrice}`;
  };

  const getTotalQuantity = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleRemove = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleChangeQuantity = (itemId, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    setCartItems(updatedCart);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 45; 
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Aseguramos que el total se envíe como número
    const parsedTotal = parseFloat(total);
  
    navigate('/payment-method', { 
      state: { 
        cartItems, 
        total: parsedTotal, 
        userId, 
        cartCount 
      } 
    });
  };
  

  return (
    <>
      <Header cartCount={cartCount} onCurrencyChange={handleCurrencyChange} />
      <div className="cart-container">
        <h1>CARRITO DE COMPRAS</h1>
        <p>Total productos: <span className="product-count">{getTotalQuantity()}</span></p>
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
                  <p className="cart-item-price">
                    Precio unitario: {convertPrice(item.price)}
                  </p>
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
            <h2>Resumen de orden</h2>
            <p>Subtotal: {convertPrice(subtotal)}</p>
            <p>Envío: {shipping > 0 ? convertPrice(shipping) : 'Gratis'}</p>
            <p className="total">Total: {convertPrice(total)}</p>
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
