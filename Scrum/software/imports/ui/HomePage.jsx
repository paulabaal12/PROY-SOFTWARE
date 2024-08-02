import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from './Components/Header';
import Footer from './Components/Footer';
import './style.css';

const categories = [
  { name: 'Hogar', image: '/images/1.png', link: '/categoria/Hogar' },
  { name: 'Videojuegos', image: '/images/2.png', link: '/categoria/Videojuegos' },
  { name: 'Belleza', image: '/images/3.png', link: '/categoria/Belleza' },
  { name: 'Juguetes', image: '/images/4.png', link: '/categoria/Juguetes' },
  { name: 'Deportes', image: '/images/5.png', link: '/categoria/Deportes' },
  { name: 'Alimentos', image: '/images/6.png', link: '/categoria/Alimentos' },
  { name: 'Mascotas', image: '/images/7.png', link: '/categoria/Mascotas' },
  { name: 'Arte', image: '/images/8.png', link: '/categoria/Arte' },
  { name: 'Electrónicos', image: '/images/9.png', link: '/categoria/Electrónicos' },
  { name: 'Tendencias', image: '/images/10.png', link: '/categoria/Tendencias' },
];
const CategoryItem = ({ name, image, link }) => (
  <Link to={link} className="category-item">
    <img src={image} alt={name} className="category-image" />
    <p className="category-name">{name}</p>
  </Link>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const handleFavoriteToggle = (product) => {
    const isFavorite = favoriteProducts.some((p) => p.id === product.id);
    if (isFavorite) {
      const updatedFavorites = favoriteProducts.filter((p) => p.id !== product.id);
      setFavoriteProducts(updatedFavorites);
      localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    } else {
      const newFavorites = [...favoriteProducts, product];
      setFavoriteProducts(newFavorites);
      localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
    }
  };

  useEffect(() => {
    const fetchProducts = () => {
      Meteor.call('productos.getAll', (error, productosData) => {
        if (error) {
          console.error('Error al obtener los productos:', error);
        } else {
          const productosOrdenados = productosData.sort((a, b) => b.id - a.id);
          setProducts(productosOrdenados.slice(0, 19));
        }
      });
    };

    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favoriteProducts');
      if (storedFavorites) {
        setFavoriteProducts(JSON.parse(storedFavorites));
      }
    };

    fetchProducts();
    loadFavorites();
  }, []);

  const handleAddToCart = (product) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      cartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cartItems.push({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        image: product.imagen_principal
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  return (
    <div className="container1">
      <Header />

      {notification.show && <div className="notification">{notification.message}</div>}
      <center><h1 className="titulo-categorias">Nuevos Productos</h1></center>
      <main className="main-content1">
        <div className="product-scroll-container">
          {products.map((product, index) => (
            <div className="product-container" key={index}>
              <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
              <h3 className='titulo-producto'>{product.nombre}</h3>
              <p className='titulo-precio'>Precio: {product.precio}</p>
              <div className="product-actions">
                <button className="button-agregar" onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
                <span className={`favorite-icon ${favoriteProducts.some(p => p.id === product.id) ? 'favorite' : ''}`}
                  onClick={() => handleFavoriteToggle(product)}>
                  &#10084;
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="categories-section">
        <h2 className="titulo-categorias">Explora nuestras categorías populares</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <CategoryItem key={index} name={category.name} image={category.image} link={category.link} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;