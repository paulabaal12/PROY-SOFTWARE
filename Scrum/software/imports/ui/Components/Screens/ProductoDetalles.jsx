import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import StarRatingComponent from 'react-star-rating-component';
import '../../style.css';

const ProductoDetalles = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [cartCount, setCartCount] = useState(0);
  const [favoriteProducts, setFavoriteProducts] = useState(JSON.parse(localStorage.getItem('favoriteProducts')) || []);
  const [calificaciones, setCalificaciones] = useState([]);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();
  const [promedioCalificacion, setPromedioCalificacion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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

  const handleImageClick = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleModalClick = () => {
    setIsZoomed(!isZoomed); // Alternar zoom
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="containerr">
      <Header cartCount={cartCount} onCurrencyChange={handleCurrencyChange} />
      
      <div className="product-page-container">
        {notification.show && (
          <div className="notification-toast">{notification.message}</div>
        )}
        
        <button onClick={() => navigate(-1)} className="back-button-link">
          ← Volver
        </button>
  
        <div className="product-detail-layout">
          <div className="product-image-container">
            <img
              src={producto?.imagen_principal}
              alt={producto?.nombre}
              className="product-main-image"
              onClick={handleImageClick}
            />
            <span className="magnify-icon" onClick={handleImageClick}>
              🔍
            </span>
          </div>
  
          {/* Modal de imagen ampliada */}
          {isModalOpen && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeModal}>&times;</span>
                <img
                  src={producto?.imagen_principal}
                  alt={producto?.nombre}
                  className={`modal-image ${isZoomed ? 'zoomed' : ''}`}
                  onClick={handleModalClick}
                />
              </div>
            </div>
          )}
  
          <div className="product-info-container">
            <h2 className="product-title1">{producto.nombre}</h2>
            <div className="product-rating">
              <div className="rating-summary">
                <h4>
                Promedio de Calificaciones: ⭐ {promedioCalificacion}
                  <span className="rating-total">/5</span>
                </h4>
              </div>
            </div>
  
            <p className="product-description">{producto.descripcion}</p>
            <h3 className="product-price1">{convertPrice(producto.precio)}</h3>
            <span className="product-category">{producto.categoria}</span>
            <p className="product-status">Estado: {producto.estado}</p>
            <div className="product-actions">
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Añadir al carrito
              </button>
              <button
                className="favorite-button"
                onClick={handleFavoriteToggle}
                aria-label={
                  favoriteProducts.some(p => p.id === producto.id)
                    ? 'Eliminar de favoritos'
                    : 'Añadir a favoritos'
                }
              >
                {favoriteProducts.some(p => p.id === producto.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
  
        <div className="calificaciones-container">
          <h3>⭐ Reseñas de Clientes</h3>
          
          {calificaciones.length === 0 ? (
            <div className="no-reviews">
              <p>No hay calificaciones aún. ¡Sé el primero en opinar!</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {calificaciones.map((calificacion, index) => (
                <div key={index} className="calificacion-item">
                  <div className="user-meta">
                    <span>👤 Usuario {calificacion.usuario_id}</span>
                    <span>🕒 {formatDate(calificacion.fecha || new Date())}</span>
                  </div>
                  <div className="rating">
                    <StarRatingComponent
                      name={`rating-${index}`}
                      starCount={5}
                      value={calificacion.calificacion}
                      editing={false}
                      starColor="#FFD700"
                      emptyStarColor="#e2e8f0"
                      renderStarIcon={() => <span className="star-icon">★</span>}
                    />
                  </div>
                  <p className="review-text">{calificacion.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="submit-calificacion">
          <h3>⭐ Deja tu calificación</h3>
          
          <div className="rating-input">
            <label>Tu puntuación:</label>
            <StarRatingComponent
              name="rate1" 
              starCount={5}
              value={rating}
              onStarClick={handleStarClick}
              starColor="#FFD700" 
              emptyStarColor="#e2e8f0" 
              editing={true}
              renderStarIcon={() => <span className="star-icon">★</span>}
            />
          </div>
          
          <div className="review-input">
            <textarea
              name="review-input"
              placeholder="Comparte tu experiencia con este producto..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleSubmitCalificacion}
            className="submit-review-button"
          >
            Enviar Reseña
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default ProductoDetalles;