import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ShoppingCartPage.css';
import Header from '../../Header';
import Footer from '../../Footer';

const ShoppingCartPage = () => {
  const navigate = useNavigate();

  // Lista temporal de productos
  const initialProducts = [
    { id: 1, name: "Producto Temporal 1", quantity: 2, price: 12.99 },
    { id: 2, name: "Producto Temporal 2", quantity: 1, price: 39.99 },
    { id: 3, name: "Producto Temporal 3", quantity: 5, price: 7.49 },
    { id: 4, name: "Producto Temporal 4", quantity: 3, price: 24.99 }
  ];

  // Inicializar estado del carrito directamente con productos temporales
  const [cartItems, setCartItems] = useState(initialProducts);

  // Guardar el carrito en almacenamiento local cuando se actualiza
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

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart">
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
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
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
