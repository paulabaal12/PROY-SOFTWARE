import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ShoppingCartPage.css';
import Header from '../../Header';
import Footer from '../../Footer';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Producto 1", quantity: 2, price: 15.99 },
    { id: 2, name: "Producto 2", quantity: 1, price: 45.99 },
    { id: 3, name: "Producto 3", quantity: 3, price: 9.99 }
  ]);

  const handleRemove = (itemId) => {
    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleChangeQuantity = (itemId, delta) => {
    const newCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + delta };
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
              <td>${item.price}</td>
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
