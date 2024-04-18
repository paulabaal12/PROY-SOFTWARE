import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Header from './Header';

// Datos de los productos
const products = [
  { name: 'Producto 1', price: '$10.00', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51bm38JKdKL._SX600_.jpg' },
  { name: 'Producto 2', price: '$15.00', imageUrl: 'https://m.media-amazon.com/images/I/81vaif8cb6L.__AC_SX300_SY300_QL70_FMwebp_.jpg' },
  // Agrega más productos aquí
];

const HomePage = () => {
  return (
    <div className="container">
      {/* Encabezado */}
      <Header/>
      {/* Contenido de la página */}
      <main className="main-content"> 
        {products.map((product, index) => (
          <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px' }} />
            <h2>{product.name}</h2>
            <p>Precio: {product.price}</p>
            <button>Agregar al carrito</button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default HomePage;

