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
      Meteor.call('productos.getAll_id', id, (error, result) => {
        if (error) {
          console.error('Error fetching product details:', error);
          setProduct(null);
        } else if (result.length > 0) {
          setProduct(result[0]); 
        } else {
          setProduct(null); 
        }
        setLoading(false);
      });
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return <p className="product-details__loading">Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p className="product-details__error">No se encontró el producto</p>;
  }

  return (
    <div className="product-details">

      <Header />
      <p>hola mundo</p>

      <main className="product-details__main">
        <h1 className="product-details__title">{product.nombre}</h1>
        <div className="product-details__content">
          <img src={product.imagen_principal} alt={product.nombre} className="product-details__image" />
          <div className="product-details__info">
            <p className="product-details__price">Precio: ${product.precio.toFixed(2)}</p>
            <p className="product-details__description">Descripción: {product.descripcion}</p>
            <p className="product-details__category">Categoría: {product.categoria}</p>
            <p className="product-details__status">Estado: {product.estado}</p>
            {product.caracteristicas && product.caracteristicas.length > 0 && (
              <div className="product-details__features">
                <h3>Características:</h3>
                <ul>
                  {product.caracteristicas.map((caracteristica, index) => (
                    <li key={index}>{caracteristica}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.imagenes_adicionales && product.imagenes_adicionales.length > 0 && (
              <div className="product-details__additional-images">
                <h3>Imágenes Adicionales HJOL :</h3>
                <div className="product-details__image-gallery">
                  {product.imagenes_adicionales.map((imagen, index) => (
                    <img key={index} src={imagen} alt={`Imagen adicional ${index + 1}`} className="product-details__additional-image" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Link to="/" className="product-details__back-button">Volver al catálogo</Link>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
