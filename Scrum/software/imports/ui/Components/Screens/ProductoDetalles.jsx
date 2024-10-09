import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const ProductoDetalles = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

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

    return () => {
      isMounted = false; // Limpiar el efecto al desmontar
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

  if (loading) {
    return <div className="loading-message1">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="containerr">
      <Header cartCount={cartCount} />
      {notification.show && <div className="notification">{notification.message}</div>}
      <button onClick={() => navigate(-1)} className="back-button">← Volver</button>
      <div className="product-container">
        <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
        <h2 className="titulo-producto">{producto.nombre}</h2>
        <p>{producto.descripcion}</p>
        <p className="titulo-precio">Precio: ${producto.precio}</p>
        <p>Categoría: {producto.categoria}</p>
        <p>Estado: {producto.estado}</p>

        {/* Botón agregado aquí para que esté siempre visible */}
        <button className="button-agregar" onClick={handleAddToCart}>Agregar al carrito</button>

        {producto.imagenes_adicionales && producto.imagenes_adicionales.length > 0 && (
          <div>
            <h3 className="image-preview-title">Imágenes Adicionales:</h3>
            <div className="image-preview-container">
              {producto.imagenes_adicionales.map((imagen, index) => (
                <img
                  key={index}
                  src={imagen}
                  alt={`${producto.nombre} - Imagen ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductoDetalles;
