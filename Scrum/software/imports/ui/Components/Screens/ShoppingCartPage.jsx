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
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState('');
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [envio, setEnvio] = useState(45); // Estado para el costo de envío, por defecto "envío estándar"

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const limpiarDescuento = () => {
    setProductosConDescuento([]);
    setDescuento(0);
    setCodigoCupon('');
    setMensajeCupon('');
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const convertPrice = (precio) => {
    const numericPrice = parseFloat(precio);
    if (isNaN(numericPrice)) {
      console.warn(`Precio inválido: ${precio}`);
      return 'Q 0.00';
    }

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
        convertedPrice = numericPrice.toFixed(2);
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

  const handleApplyCupon = () => {
    Meteor.call('cupones.validate', codigoCupon, (error, result) => {
      if (error) {
        setMensajeCupon('Cupón inválido o expirado.');
        limpiarDescuento();
      } else {
        setDescuento(parseFloat(result.descuento));
        setProductosConDescuento([result.producto_id]);
        setMensajeCupon(`Cupón aplicado: ${result.descuento}% de descuento.`);
      }
    });
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountTotal = cartItems.reduce((acc, item) => {
    if (productosConDescuento.includes(item.id)) {
      return acc + item.price * item.quantity * (descuento / 100);
    }
    return acc;
  }, 0);

  // Calcula el total final, restando el descuento total y sumando el costo de envío
  const total = subtotal - discountTotal + envio;

  // Al hacer checkout, incluir opcion_envio en los datos de navegación
  const handleCheckout = () => {
    const parsedTotal = parseFloat(total);
    navigate('/payment-method', {
      state: {
        cartItems,
        total: parsedTotal,
        userId,
        cartCount,
        descuento,
        productosConDescuento,
        opcion_envio: envio // Asegúrate de que el tipo de envío se pase correctamente
      },
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
                />
                <div className="cart-item-info">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <p className="cart-item-price">Precio unitario: {convertPrice(item.price)}</p>
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
            <p>Descuento: {discountTotal > 0 ? `- ${convertPrice(discountTotal)} (${descuento}% aplicado)` : 'No hay descuento'}</p>
            
            <div className="shipping-options">
              <h3>Opciones de Envío</h3>
              <div>
                <label>
                  <input
                    type="radio"
                    name="envio"
                    value="estandar"
                    checked={envio === 45}
                    onChange={() => setEnvio(45)}
                  />
                  Envío estándar (Q45)
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="envio"
                    value="urgente"
                    checked={envio === 55}
                    onChange={() => setEnvio(55)}
                  />
                  Envío urgente (Q55)
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="envio"
                    value="pickup"
                    checked={envio === 0}
                    onChange={() => setEnvio(0)}
                  />
                  Recoger en tienda (Q0)
                </label>
              </div>
            </div>
       
            <p>Envío: {convertPrice(envio)}</p>
            <div className="coupon-section">
              <input 
                type="text" 
                className="inputCouponSection"
                placeholder="Ingresa el código de cupón" 
                value={codigoCupon}
                onChange={(e) => setCodigoCupon(e.target.value)}
              />
              <button onClick={handleApplyCupon}>Aplicar Cupón</button>
              {mensajeCupon && <p>{mensajeCupon}</p>}
            </div>
            <p className="total">Total: {convertPrice(total)}</p>
            <button onClick={handleCheckout} className="checkout-button">Ir a Pagar</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCartPage;
