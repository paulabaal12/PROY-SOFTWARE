import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const Favorito = ({ favoriteProducts }) => {
  return (
    <div className="container1">
      <Header />
      <center>
        <h1>Productos Favoritos</h1>
      </center>
      <main className="main-content1">
        <div className="product-scroll-container">
          {favoriteProducts && favoriteProducts.length > 0 ? (
            favoriteProducts.map((product, index) => (
              <div className="product-container" key={index}>
                <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
                <h3 className='titulo-producto'>{product.nombre}</h3>
              </div>
            ))
          ) : (
            <p>No hay productos favoritos.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorito;