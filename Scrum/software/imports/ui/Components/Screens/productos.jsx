import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';


const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = () => {
      Meteor.call('productos.getAll', (error, productosData) => {
        if (error) {
          console.error('Error al obtener los productos:', error);
          setLoading(false);
        } else {
          setProducts(productosData);
          setLoading(false);
        }
      });
    };

    fetchProducts();
  }, []);

  return (
    <div className="container1">
      <Header />
      <main className="main-content1">
        <h1 className="titulo-categorias">Todos los Productos</h1>
        {loading ? (
          <p className="loading-message">Cargando productos...</p>
        ) : products.length > 0 ? (
          <div className="product-scroll-container">
            {products.map((product) => (
              <div className="product-container" key={product.id}>
                <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
                <h3 className='titulo-producto'>{product.nombre}</h3>
                <p className='titulo-precio'>Precio: {product.precio}</p>
                <div className="product-actions">
                  <Link to={`/producto/${product.id}`} className="button-agregar">Ver Detalles</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results-message">No se encontraron productos.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Productos;
