import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const categories = [
    "Hogar", "Electrónicos", "Libros", "Accesorio",
    "Juguetes", "Deportes", "Belleza", "Alimentos",
    "Automóviles", "Viajes", "Mascotas", "Salud",
    "Jardín", "Herramientas", "Arte", "Música", 
    "Videojuegos", "Higiene"
  ];

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      Meteor.call('productos.getAll', (error, result) => {
        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          setProducts(result);
        }
        setLoading(false);
      });
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  const filteredProducts = products.filter(product =>
    product.precio >= priceRange[0] &&
    product.precio <= priceRange[1] &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.categoria)) 
  );

  if (loading) {
    return <p className="product-catalog__loading">Cargando productos...</p>;
  }

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency); // Actualizamos la moneda cuando cambia
  };

  const convertPrice = (precio) => {
    let numericPrice = parseFloat(precio); // Asegúrate de convertir a número
  
    if (isNaN(numericPrice)) {
      console.warn(`Precio inválido: ${precio}`);
      numericPrice = 0; // Asignar valor por defecto si no es válido
    }
  
    const currency = localStorage.getItem('currency') || 'GT';
    let convertedPrice, symbol;
  
    switch (currency) {
      case 'USD':
        convertedPrice = (numericPrice / 8).toFixed(2);
        symbol = '$';
        break;
      case 'EUR':
        convertedPrice = (numericPrice / 9).toFixed(2);
        symbol = '€';
        break;
      case 'GBP':
        convertedPrice = (numericPrice / 11).toFixed(2);
        symbol = '£';
        break;
      default:
        convertedPrice = numericPrice.toFixed(2); // Quetzales por defecto
        symbol = 'Q';
    }
  
    return `${symbol} ${convertedPrice}`;
  };

  const getCurrencySymbol = () => {
    const currency = localStorage.getItem('currency') || 'GTQ';
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return 'Q'; // Quetzal como moneda por defecto
    }
  };

  const handleAddToCart = (producto) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find(item => item.id === producto.id);

    if (existingProduct) {
      cartItems = cartItems.map(item =>
        item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cartItems.push({
        id: producto.id,
        name: producto.nombre,
        price: producto.precio,
        quantity: 1,
        image: producto.imagen_principal
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0)); // Actualiza el contador
  };

  return (
    <div>
      <Header cartCount={cartCount}  onCurrencyChange={handleCurrencyChange} />
      {notification.show && <div className="notification">{notification.message}</div>} 
      <main className="product-catalog__main">
        <h1 className="product-catalog__title">Catálogo de Productos</h1>
        <div className="product-catalog__container">
          <aside className="product-catalog__filter">
            <h2 className="product-catalog__filter-title">Filtros</h2>
            <div className="product-catalog__price-filter">
              <h3>Precio</h3>
              <p>{getCurrencySymbol()}{priceRange[0]} - {getCurrencySymbol()}{priceRange[1]}</p>
              <input
                type="range"
                min={0}
                max={100000000}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, [priceRange[0], Number(e.target.value)])}
                className="product-catalog__price-slider"
              />
            </div>
            <div className="product-catalog__brand-filter">
              <h3>Categorías</h3>
              {categories.map(category => (
                <label key={category} className="product-catalog__brand-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </aside>
          <div className="product-catalog__grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-catalog__card">
              <img src={product.imagen_principal} alt={product.nombre} className="product-catalog__image" />
              <h2 className="product-catalog__name">{product.nombre}</h2>
              <p className="product-catalog__price">{convertPrice(product.precio)}</p>
              <Link to={`/productos/${product.id}`} className="product-catalog__button">Ver detalles</Link><br />
              <button className="button-add" onClick={() => handleAddToCart(product)}>
                Agregar al carrito
              </button>
            </div>
          ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductCatalog;
