import React from 'react';

const ProductList = ({ products, onAddToCart, onMoreInfo, onFavoriteToggle, favoriteProducts }) => (
  <div className="product-scroll-container">
    {products.map((product) => (
      <div className="product-container" key={product.id}>
        <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-price">Precio: {product.precio}</p>
          <button className="button-add" onClick={() => onAddToCart(product)}>Agregar al carrito</button>
          <button className="button-info" onClick={() => onMoreInfo(product.id)}>Más Información</button>
          <span 
            className={`favorite-icon ${favoriteProducts.some(p => p.id === product.id) ? 'favorite' : ''}`}
            onClick={() => onFavoriteToggle(product)}
          >
            &#10084;
          </span>
      </div>
    ))}
  </div>
);

export default ProductList;