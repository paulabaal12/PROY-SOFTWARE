import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import StarRatingComponent from 'react-star-rating-component'; // Importamos la librería de estrellas
import '../../style.css';

const ProductoDetalles = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [cartCount, setCartCount] = useState(0);
  const [favoriteProducts, setFavoriteProducts] = useState(
    JSON.parse(localStorage.getItem('favoriteProducts')) || []
  );
  const [calificaciones, setCalificaciones] = useState([]);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();
  const [promedioCalificacion, setPromedioCalificacion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    Meteor.call('productos.getAll_id', Number(productoId), (err, result) => {
      if (isMounted) {
        if (err) {
          console.error('Error al obtener el producto:', err);
          setError('Error al cargar el producto');
          setLoading(false);
        } else if (result.length > 0) {
          setProducto(result[0]); // Establecer el producto encontrado
          setLoading(false);
        } else {
          setError('Producto no encontrado');
          setLoading(false);
        }
      }
    });

    Meteor.call('calificaciones.getByProducto', Number(productoId), (error, result) => {
      if (!error) setCalificaciones(result);
      else console.error('Error al obtener calificaciones:', error);
    });

    return () => {
      isMounted = false;
    };
  }, [productoId]);

  const handleAddToCart = () => {
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
        image: producto.imagen_principal,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
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
  

  const handleFavoriteToggle = () => {
    const isFavorite = favoriteProducts.some(p => p.id === producto.id);
    const newFavorites = isFavorite
      ? favoriteProducts.filter(p => p.id !== producto.id)
      : [...favoriteProducts, producto];
    
    setFavoriteProducts(newFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
    setNotification({ show: true, message: isFavorite ? 'Producto eliminado de favoritos' : 'Producto añadido a favoritos' });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  }

  const handleSubmitCalificacion = () => {
    const userId = Number(localStorage.getItem('userId')); // Validamos que sea un número
    const nuevaCalificacion = {
      producto_id: Number(productoId),
      usuario_id: userId,
      calificacion: rating,
      comentario,
    };

    Meteor.call('calificaciones.insert', nuevaCalificacion, (error) => {
      if (error) {
        console.error('Error al enviar la calificación:', error);
      } else {
        console.log('Calificación enviada correctamente');
        setCalificaciones([...calificaciones, nuevaCalificacion]);
        setRating(0);
        setComentario('');
      }
    });
  };

  Meteor.call('calificaciones.getByProducto', Number(productoId), (error, result) => {
    if (!error) {
      setCalificaciones(result);
      calcularPromedio(result); // Llamar al cálculo del promedio
    } else {
      console.error('Error al obtener calificaciones:', error);
    }
  });

  const handleStarClick = (nextValue) => setRating(nextValue);

  if (loading) {
    return <div className="loading-message1">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }  
  
  const calcularPromedio = (calificaciones) => {
    if (calificaciones.length > 0) {
      const total = calificaciones.reduce((sum, cal) => sum + cal.calificacion, 0);
      const promedio = total / calificaciones.length;
      setPromedioCalificacion(promedio.toFixed(1)); // Mostrar con un decimal
    } else {
      setPromedioCalificacion(0); // Sin calificaciones, promedio es 0
    }
  };

  return (
    <div className="containerr">
      <Header cartCount={cartCount}  onCurrencyChange={handleCurrencyChange} />
      {notification.show && <div className="notification">{notification.message}</div>}
      <button onClick={() => navigate(-1)} className="back-button">← Volver</button>

      <div className="product-centered">
        <div className="product-details-container">
          <div className="image-container">
            <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
          </div>
          <div className="details-container">
            <h2 className="titulo-producto">{producto.nombre}</h2>
            <center>
            <h3>Promedio de Calificaciones: ⭐ {promedioCalificacion}/5</h3>
            </center>
            <p>Descripción: {producto.descripcion}</p>
            <h3 className="titulo-precio">Precio: {convertPrice(producto.precio)}</h3>
            <p>Categoría: {producto.categoria}</p>
            <p>Estado: {producto.estado}</p>

            <button className="button-agregar" onClick={handleAddToCart}>Agregar al carrito</button>
            <button className="button-favorito" onClick={handleFavoriteToggle}>
              {favoriteProducts.some(p => p.id === producto.id) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>
          
        {/* Sección de Calificaciones y Comentarios */}
        <div className="reviews-section">

        <div className="rating-section">
            <h2>Deja tu calificación</h2>
            <StarRatingComponent
              name="rating"
              starCount={5}
              value={rating}
              onStarClick={handleStarClick}
            /><br></br>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Deja un comentario..."
            /><br></br>
            <button onClick={handleSubmitCalificacion}>Enviar Comentario</button>
          </div>
          <hr />


          <h1>Calificaciones y Comentarios</h1>
          {calificaciones.length > 0 ? (
            calificaciones.map((cal, index) => (
              <div key={index} className="calificacion">
                <p><strong>Usuario: </strong> {cal.usuario_nombre}</p>
                <p><strong>⭐ {cal.calificacion}/5</strong></p>
                <p>{cal.comentario}</p>
              </div>
            ))
          ) : (
            <p>No hay calificaciones aún.</p>
          )}


          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductoDetalles;
