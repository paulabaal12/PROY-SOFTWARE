import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProductList from './Components/Screens/ProductList';
import CategoryGrid from './Components/Screens/CategoryGrid';
import './style.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
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

  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario
  useEffect(() => {
    if (!userId) {
      console.warn('No se encontró un ID de usuario. Redirigiendo al login.');
      navigate('/login'); // Redirigir si no hay ID
    } else {
      fetchProducts(); // Si hay ID, carga los productos
    }
  }, [userId]);
  
  

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency); // Actualizamos la moneda cuando cambia
  };

  const convertPrice = (precio) => {
    if (isNaN(precio)) {
      console.warn(`Precio inválido: ${precio}`);
      precio = 0; // Asignar un valor por defecto si no es un número válido
    }
  
    const currency = localStorage.getItem('currency') || 'GT';
    let convertedPrice, symbol;
  
    switch (currency) {
      case 'USD':
        convertedPrice = (precio / 8).toFixed(2);
        symbol = '$';
        break;
      case 'EUR':
        convertedPrice = (precio / 9).toFixed(2);
        symbol = '€';
        break;
      case 'GBP':
        convertedPrice = (precio / 11).toFixed(2);
        symbol = '£';
        break;
      default:
        convertedPrice = precio.toFixed(2); // Quetzales por defecto
        symbol = 'Q';
    }
  
    return `${symbol} ${convertedPrice}`;
  };
  

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

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const handleAddToCart = (product) => {
    if (!product || !product.precio) {
      console.warn('Producto inválido o sin precio:', product);
      return; // Evita agregar un producto sin precio
    }
  
    // Limpiar el precio: Extraer solo la parte numérica
    const cleanedPrice = parseFloat(product.precio.replace(/[^0-9.-]+/g, ''));
  
    if (isNaN(cleanedPrice)) {
      console.warn('Precio inválido después de limpiar:', product.precio);
      return; // Evita agregar si el precio sigue siendo inválido
    }
  
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find(item => item.id === product.id);
  
    if (existingProduct) {
      cartItems = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      cartItems.push({
        id: product.id,
        name: product.nombre,
        price: cleanedPrice, // Guardamos el precio limpio como número
        quantity: 1,
        image: product.imagen_principal || '/path-to-placeholder-image.png',
      });
    }
  
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
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

  const handleTitleClick = () => {
    navigate('/productos');
  };

  

  return (
    <div className="container3">
      <Header cartCount={cartCount} onCurrencyChange={handleCurrencyChange} />
      {notification.show && 
        <div className="notification">
          <img src={'/images/carrito.png'} alt="Icono" className="notification-icon" />
          {notification.message}
        </div>
      }
      <main className="categories-section2">
        <div className="section-title-container" onClick={handleTitleClick}>
          <h2 className="section-title">Nuevos Productos</h2>
          <span className="arrow-icon">&gt;</span>
        </div>
        <ProductList 
          products={products.map(product => ({ ...product, precio: convertPrice(Number(product.precio))}))} 
          onAddToCart={(product) => handleAddToCart(product)} 
          onMoreInfo={handleMoreInfoClick}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteProducts={favoriteProducts}
        />
        <section className="categories-section">
          <h2 className="section-title">Explora nuestras categorías populares</h2>
          <CategoryGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
