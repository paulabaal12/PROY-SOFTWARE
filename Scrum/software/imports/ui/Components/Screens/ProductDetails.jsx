import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductDetails = () => {
      setLoading(true);
      Meteor.call('productos.getDetails', id, (error, result) => {
        if (error) {
          console.error('Error fetching product details:', error);
          setProduct(null);
        } else {
          setProduct(result);
        }
        setLoading(false);
      });
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return <p className="loading-message">Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p className="error-message">No se encontró el producto</p>;
  }

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h1 className="product-title">{product.nombre}</h1>
        <div className="product-details">
          <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
          <div className="product-info">
            <p className="product-price">Precio: ${product.precio}</p>
            <p className="product-description">Descripción: {product.descripcion}</p>
            <p className="product-stock">Stock: {product.stock} unidades</p>
            <p className="product-category">Categoría: {product.categoria}</p>
            {product.caracteristicas && (
              <div className="product-features">
                <h3>Características:</h3>
                <ul>
                  {product.caracteristicas.map((caracteristica, index) => (
                    <li key={index}>{caracteristica}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Link to="/search" className="back-button">Volver a los resultados</Link>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;