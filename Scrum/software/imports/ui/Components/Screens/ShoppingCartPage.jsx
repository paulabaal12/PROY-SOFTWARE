import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Recuperamos el userId del localStorage

  console.log('User ID en ShoppingCartPage:', userId); // Verificar si el userId está disponible

  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const handleRemove = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleChangeQuantity = (itemId, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0);
    const shipping = 5;
    const total = subtotal + shipping;

    console.log('Cart Items:', cartItems); // Verificar los productos en el carrito
    console.log('Total:', total); // Verificar el total
    console.log('User ID en Checkout:', userId); // Verificar que el userId se pase

    // Aseguramos que los datos se pasen correctamente en la navegación
    navigate('/payment-method', { state: { cartItems, total, userId } });
  };

  
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency); // Actualizamos la moneda cuando cambia
  };

  const convertPrice = (precio) => {
    if (isNaN(precio)) {
      console.warn(`Precio inválido: ${precio}`);
      precio = 0; // Asignar un valor por defecto si no es un número válido
    }
  
    const currency = localStorage.getItem('currency') || 'GT';
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
        convertedPrice = precio.toFixed(2); // Quetzales por defecto
        symbol = 'Q';
    }
  
    return `${symbol} ${convertedPrice}`;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5; 
  const total = subtotal + shipping;

  return (
    <>
      <Header cartCount={cartCount}  onCurrencyChange={handleCurrencyChange}  />
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
                  <p className="cart-item-price">${parseFloat(item.price || 0).toFixed(2)}</p>
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
