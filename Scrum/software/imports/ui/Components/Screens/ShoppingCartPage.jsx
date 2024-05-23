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
    <div className="container1 shopping-cart">
      <Header />
      <h1>Carrito de Compras</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <button onClick={() => handleChangeQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                {item.quantity}
                <button onClick={() => handleChangeQuantity(item.id, 1)}>+</button>
              </td>
              <td>${item.price ? item.price.toFixed(2) : '0.00'}</td>
              <td>${item.price ? (item.quantity * item.price).toFixed(2) : '0.00'}</td>
              <td>
                <button onClick={() => handleRemove(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="checkout">
        <p>Total: ${total.toFixed(2)}</p>
        <button onClick={handleCheckout}>Proceder al Pago</button>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;
