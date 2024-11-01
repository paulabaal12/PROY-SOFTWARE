import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const Favorito = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favoriteProducts');
      if (storedFavorites) {
        setFavoriteProducts(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  const handleMoreInfo = (productId) => {
    navigate(`/productos/${productId}`);
  };

  const handleRemoveFavorite = (productId) => {
    const updatedFavorites = favoriteProducts.filter(product => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites-container">
      <Header />
      <div className="favorites-title">
        <h1>Productos Favoritos</h1>
        <p className="favorites-count">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>
      <main className="favorites-main">
        {favoriteProducts && favoriteProducts.length > 0 ? (
          <div className="favorites-grid">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="favorite-card">
                <span 
                  className="favorite-heart-icon favorite"
                  onClick={() => handleRemoveFavorite(product.id)}
                  role="button"
                  aria-label="Eliminar de favoritos"
                >
                  &#10084;
                </span>
                <div className="favorite-image-wrapper">
                  <img
                    src={product.imagen_principal}
                    alt={product.nombre}
                    className="favorite-image"
                    loading="lazy"
                  />
                </div>
                <div className="favorite-content">
                  <h3 className="favorite-title">{product.nombre}</h3>
                  <button
                    onClick={() => handleMoreInfo(product.id)}
                    className="favorite-details-btn"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-favorites-container">
            <p className="no-favorites">No hay productos favoritos.</p>
            <button 
              onClick={() => navigate('/productos')}
              className="browse-products-btn"
            >
              Explorar Productos
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorito;