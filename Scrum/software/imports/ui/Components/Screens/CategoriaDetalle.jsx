import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const CategoriaDetalle = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [filtros, setFiltros] = useState({
    precioMin: 0,
    precioMax: 1000000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Nombre de la categoría:', nombre);
    Meteor.call('productos.getAll', (error, result) => {
      if (error) {
        console.error('Error al obtener productos:', error);
      } else if (result) {
        // Filtra productos según la categoría proporcionada por el parámetro 'nombre'
        const productosFiltrados = result.filter(producto => 
          producto.categoria && producto.categoria.toLowerCase() === nombre.toLowerCase()
        );
        setProductos(productosFiltrados);
      }
      setIsLoading(false);
    });
  }, [nombre]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: parseFloat(value)
    }));
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
  

  const handleMoreInfoClick = (productoId) => {
    navigate(`/productos/${productoId}`);
  };

  const productosFiltrados = productos.filter(producto => 
    producto.precio >= filtros.precioMin && producto.precio <= filtros.precioMax
  );

  if (isLoading) {
    return <p className="product-catalog__loading">Cargando productos...</p>;
  }

  return (
    <div>
      <Header cartCount={cartCount}  onCurrencyChange={handleCurrencyChange} />
      {notification.show && <div className="notification">{notification.message}</div>}
      <div className="categoria-detalle-container">
        <h1>{nombre}</h1>
        <div className="categoria-content">
          <aside className="product-catalog__filter">
            <h2 className="product-catalog__filter-title">Filtros</h2>
            <div className="product-catalog__price-filter">
              <h3>Precio</h3>
              <p>{getCurrencySymbol()}{filtros.precioMin} - {getCurrencySymbol()}{filtros.precioMax}</p>
              <input
                type="range"
                min={0}
                max={1000000}
                name="precioMax"
                value={filtros.precioMax}
                onChange={handleFiltroChange}
                className="product-catalog__price-slider"
              />
            </div>
          </aside>
          <main className="product-catalog__grid">
            {productosFiltrados.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="product-container">
                  <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
                  <h3 className='titulo-producto'>{producto.nombre}</h3>
                  <p className='titulo-precio'>Precio: {convertPrice(producto.precio)}</p>
                  <div className="product-buttons">
                    <button className="button-add" onClick={() => handleAddToCart(producto)}>
                      Agregar al carrito
                    </button>
                    <button className="button-info" onClick={() => handleMoreInfoClick(producto.id)}>
                      Más Información
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriaDetalle;
