import React from 'react';

const ShoppingCartPage = ({ onCheckout }) => (
  <div className="shopping-cart-container">
    <div className="form-container">
      <h1 className="centered">Carrito de Compras</h1>
      {/* Aquí iría el código para listar los productos en el carrito */}
      <button onClick={onCheckout} className="btn">Checkout</button>
    </div>
  </div>
);




export default ShoppingCartPage;
