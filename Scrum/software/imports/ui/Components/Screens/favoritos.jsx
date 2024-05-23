import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
const Favorito = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favoriteProducts');
      if (storedFavorites) {
        setFavoriteProducts(JSON.parse(storedFavorites));
      }
    };

    loadFavorites();
  }, []);

  return (
    <div className="containerfavoritos">
      <Header />
      <center>
        <h1>Productos Favoritos</h1>
      </center>
      <main className="main-contentfavorito">
        {favoriteProducts && favoriteProducts.length > 0 ? (
          <div className="product-grid">
            {favoriteProducts.map((product, index) => (
              <div className="product-containerfavorito" key={index}>
                <div className="product-image-container">
                  <img
                    src={product.imagen_principal}
                    alt={product.nombre}
                    className="product-image"
                  />
                </div>
                <h3 className="titulo-producto">{product.nombre}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos favoritos.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorito;