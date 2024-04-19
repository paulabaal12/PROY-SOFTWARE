import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ShoppingCartPage.css'

const ShoppingCartPage = () => {
  
  const navigate = useNavigate();
  // Los datos del carrito se podrían pasar mediante props o obtener desde un contexto o redux store
  const cartItems = [
    { id: 1, name: "Producto 1", quantity: 2, price: 15.99 },
    { id: 2, name: "Producto 2", quantity: 1, price: 45.99 },
    { id: 3, name: "Producto 3", quantity: 3, price: 9.99 }
  ];

  const handleRemove = (itemId) => {
    // Implementar lógica para manejar la eliminación de un producto del carrito
    console.log("Eliminar producto", itemId);
  };

  const handleCheckout = () => {
    // Implementar lógica para el proceso de pago/checkout
    navigate('/payment-summary'); 
    console.log("Proceder al pago");
  };

  return (
    <div className="shopping-cart">
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
              <td>{item.quantity}</td>
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
        <button onClick={handleCheckout}>Proceder al Pago</button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
