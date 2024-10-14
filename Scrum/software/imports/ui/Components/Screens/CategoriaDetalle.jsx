import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const CategoriaDetalle = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
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
      } else {
        console.log('Todos los productos:', result);
        const productosFiltrados = result.filter(producto => 
          producto.categoria.toLowerCase() === nombre.toLowerCase()
        );
        console.log('Productos filtrados por categoría:', productosFiltrados);
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

  const handleMoreInfoClick = (productoId) => {
    navigate(`/productos/${productoId}`);
  };

  const productosFiltrados = productos.filter(producto => 
    producto.precio >= filtros.precioMin && producto.precio <= filtros.precioMax
  );

  console.log('Productos filtrados por precio:', productosFiltrados);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header cartCount={cartCount} />
      {notification.show && <div className="notification">{notification.message}</div>}
      <div className="categoria-detalle-container">
        <h1>{nombre}</h1>
        <div className="categoria-content">
          <aside className="filtros-sidebar">
            <h2>Filtros</h2>
            <div>
              <label>Precio Mínimo:</label>
              <input 
                type="number" 
                name="precioMin" 
                value={filtros.precioMin} 
                onChange={handleFiltroChange}
              />
            </div>
            <div>
              <label>Precio Máximo:</label>
              <input 
                type="number" 
                name="precioMax" 
                value={filtros.precioMax} 
                onChange={handleFiltroChange}
              />
            </div>
          </aside>
          <main className="productos-grid">
            {productosFiltrados.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="product-container">
                  <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
                  <h3 className='titulo-producto'>{producto.nombre}</h3>
                  <p className='titulo-precio'>Precio: ${producto.precio}</p>
                  <button className="button-agregar" onClick={() => handleAddToCart(producto)}>
                    Agregar al carrito
                  </button>
                  <button className="button-info" onClick={() => handleMoreInfoClick(producto.id)}>
                    Más Información
                  </button>
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
