import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const InventoryManagement = () => {
  const [productos, setProductos] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    estado: '',
    imagen_principal: null,
    imagenes_adicionales: [],
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario

  useEffect(() => {
    if (!userId) {
      console.warn('No se encontró un ID de usuario. Redirigiendo al login.');
      navigate('/login'); // Redirige si no hay ID
    } else {
      console.log(`ID del usuario recuperado: ${userId}`);
      fetchUserProductos(userId); // Carga los productos
    }
  }, [userId, navigate]);
  


  const fetchUserProductos = (id) => {
    console.log(`Obteniendo productos para el usuario con ID: ${id}`);
  
    Meteor.call('productos.getByUser', parseInt(id), (err, res) => {
      if (err) {
        console.error('Error al obtener productos:', err);
        alert(`Error al obtener productos: ${err.reason || err.message}`);
      } else if (Array.isArray(res)) {
        console.log('Productos obtenidos:', res);
        setProductos(res);
      } else {
        console.warn('Respuesta inesperada:', res);
        setProductos([]);
      }
    });
  };
  
  
  
  const handleAddProduct = () => {
    if (!usuarioId) {
      console.error('Error: No se puede añadir producto sin un usuario autenticado.');
      return;
    }

    const productoConUsuario = { ...nuevoProducto, usuario_id: usuarioId };
    Meteor.call('productos.insert', productoConUsuario, (err) => {
      if (err) {
        console.error('Error al añadir producto:', err);
        alert(`Error al añadir producto: ${err.reason || err.message}`);
      } else {
        setNotification({ show: true, message: 'Producto añadido correctamente' });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
        setShowAddModal(false);
        fetchUserProductos(usuarioId);
      }
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === 'imagen_principal' ? files[0] : Array.from(files),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="containerr">
      <Header cartCount={0} />
      <div className="inventory-page">
        <h1 className="titulo1">Gestión de Inventario</h1>

        {notification.show && (
          <div className="notification">
            <img src={'/images/carrito.png'} alt="Notificación" className="notification-icon" />
            {notification.message}
          </div>
        )}

        <button className="add-button" onClick={() => setShowAddModal(true)}>
          Añadir Nuevo Producto
        </button>

        {productos.length > 0 ? (
        <div className="inventory-grid">
            {productos.map((producto) => (
            <div key={producto.id} className="inventory-card">
                <img
                src={producto.imagen_principal || '/images/placeholder.png'}
                alt={producto.nombre}
                className="product-image"
                />
                <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-price">
                    Q{typeof producto.precio === 'number' ? producto.precio.toFixed(2) : '0.00'}
                </p>
                <p className="product-category">
                    <strong>Categoría:</strong> {producto.categoria || 'Sin categoría'}
                </p>
                <p className="product-status">
                    <strong>Estado:</strong> {producto.estado || 'Sin estado'}
                </p>
                </div>
            </div>
            ))}
        </div>
        ) : (
        <p>No hay productos en el inventario.</p>
        )}


        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Añadir Nuevo Producto</h2>
              <form>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={nuevoProducto.nombre} onChange={handleChange} />
                <label>Descripción:</label>
                <textarea name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} />
                <label>Precio:</label>
                <input type="number" name="precio" value={nuevoProducto.precio} onChange={handleChange} />
                <label>Categoría:</label>
                <input type="text" name="categoria" value={nuevoProducto.categoria} onChange={handleChange} />
                <label>Estado:</label>
                <input type="text" name="estado" value={nuevoProducto.estado} onChange={handleChange} />
                <label>Imagen Principal:</label>
                <input type="file" name="imagen_principal" onChange={handleFileChange} />
                <label>Imágenes Adicionales:</label>
                <input type="file" name="imagenes_adicionales" multiple onChange={handleFileChange} />

                <button type="button" onClick={handleAddProduct} className="add-button">Guardar Producto</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-button">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InventoryManagement;
