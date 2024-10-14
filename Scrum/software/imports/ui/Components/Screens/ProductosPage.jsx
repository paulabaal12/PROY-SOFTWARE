// src/Components/Screens/ProductosPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ProductList from './ProductList';
import '../../style.css';

const ProductosPage = () => {
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    loadFavorites();
    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const fetchProducts = () => {
    Meteor.call('productos.getAll', (error, productosData) => {
      if (error) {
        console.error('Error al obtener los productos:', error);
      } else {
        setProducts(productosData);
      }
    });
  };

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem('favoriteProducts');
    if (storedFavorites) {
      setFavoriteProducts(JSON.parse(storedFavorites));
    }
  };

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const handleAddToCart = (product) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      cartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
  };

  const handleMoreInfoClick = (productoId) => {
    navigate(`/productos/${productoId}`);
  };

  const handleFavoriteToggle = (product) => {
    const newFavorites = favoriteProducts.some(p => p.id === product.id)
      ? favoriteProducts.filter(p => p.id !== product.id)
      : [...favoriteProducts, product];

    setFavoriteProducts(newFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
  };

  return (
    <div className="container3">
      <Header cartCount={cartCount} />
      <main>
        <h1>Todos los Productos</h1>
        <ProductList
          products={products}
          onAddToCart={handleAddToCart}
          onMoreInfo={handleMoreInfoClick}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteProducts={favoriteProducts}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ProductosPage;
