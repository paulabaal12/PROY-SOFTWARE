import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const InventoryManagement = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]); // Estado para almacenar los pedidos
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [showPedidos, setShowPedidos] = useState(false); 
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    estado: '',
    imagen_principal: '',
    imagenes_adicionales: '',
  });

  const categorias = [
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Electrónicos', label: 'Electrónicos' },
    { value: 'Ropa', label: 'Ropa' },
    { value: 'Juguetes', label: 'Juguetes' },
    { value: 'Deportes', label: 'Deportes' },
  ];
  
  const estados = [
    { value: 'Nuevo', label: 'Nuevo' },
    { value: 'Usado', label: 'Usado' },
  ];
  

  const openAddCouponModal = (productId) => {
    setSelectedProductId(productId);
    setShowAddCouponModal(true);
  };

  const handleApplyCoupon = () => {
    if (selectedProductId) {
      const couponData = {
        codigo: couponCode,
        descuento: discountPercentage,
        producto_id: selectedProductId,
        fecha_expiracion: expirationDate, // Asegúrate de que expirationDate tenga un valor válido
      };
  
      Meteor.call('cupones.apply', couponData, (err, result) => {
        if (err) {
          console.error("Error al aplicar cupón:", err.message); // Log detallado del error
          setNotification({ show: true, message: `Error al aplicar cupón: ${err.reason || 'Intenta de nuevo'}` });
        } else {
          setNotification({ show: true, message: `Cupón aplicado: ${discountPercentage}% de descuento` });
          fetchUserProductos(userId);
        }
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
        closeAddCouponModal();
      });
    }
  };
  
  
  

  const closeAddCouponModal = () => {
    setShowAddCouponModal(false);
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchUserProductos(userId);
    }
  }, [userId, navigate]);

  const fetchUserProductos = (id) => {
    Meteor.call('productos.getByUser', parseInt(id), (err, res) => {
      if (err) {
        alert(`Error al obtener productos: ${err.reason || err.message}`);
      } else if (Array.isArray(res)) {
        setProductos(res);
      }
    });
  };


  const fetchPedidos = () => {
    Meteor.call('pedidos.getByUser', parseInt(userId), (err, pedidosRes) => {
      if (err) {
        alert(`Error al obtener pedidos: ${err.reason || err.message}`);
      } else {
        // Asegúrate de que los IDs sean números y únicos
        const productIds = pedidosRes
        .map(pedido => Number(pedido.producto_id))  // Asegura que los IDs sean números
        .filter(id => !isNaN(id));  // Filtra cualquier valor no numérico

  
        // Llamada para obtener los productos por sus IDs
        Meteor.call('productos.getByIds', productIds, (error, productosRes) => {
          if (error) {
            alert(`Error al obtener productos: ${error.reason || error.message}`);
          } else {
            // Combina los pedidos con los productos
            const pedidosConNombres = pedidosRes.map(pedido => {
              const producto = productosRes.find(prod => prod.id === pedido.producto_id);
              return {
                ...pedido,
                productoNombre: producto ? producto.nombre : 'Producto desconocido',
              };
            });
  
            setPedidos(pedidosConNombres);
            setShowPedidos(true);
          }
        });
      }
    });
  };
  
  

  const handleVolver = () => {
    setShowPedidos(false);
  };

  const handleAddOrUpdateProduct = () => {
    const updatedProductData = {
      usuario_id: parseInt(userId),
      nombre: nuevoProducto.nombre || '',
      descripcion: nuevoProducto.descripcion || '',
      precio: parseFloat(nuevoProducto.precio) || 0,
      categoria: nuevoProducto.categoria || '',
      estado: nuevoProducto.estado || '',
      imagen_principal: nuevoProducto.imagen_principal || '',
      imagenes_adicionales: Array.isArray(nuevoProducto.imagenes_adicionales)
        ? nuevoProducto.imagenes_adicionales
        : (nuevoProducto.imagenes_adicionales ? nuevoProducto.imagenes_adicionales.split(',') : [])
    };
  
    if (editingProduct) {
      // Llamada a handleUpdateProduct
      handleUpdateProduct(editingProduct.id, updatedProductData);
    } else {
      // Inserta un nuevo producto
      Meteor.call('productos.insert', updatedProductData, (err) => {
        if (err) {
          alert(`Error al añadir producto: ${err.reason || err.message}`);
        } else {
          setNotification({ show: true, message: 'Producto añadido correctamente' });
          setTimeout(() => setNotification({ show: false, message: '' }), 3000);
          fetchUserProductos(userId);
          handleCancelar();
        }
      });
    }
  };
  
  const handleUpdateProduct = (id, updatedData) => {
    Meteor.call('productos.update', id, updatedData, (err) => {
      if (err) {
        alert(`Error al actualizar producto: ${err.reason || err.message}`);
      } else {
        setNotification({ show: true, message: 'Producto actualizado correctamente' });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
        fetchUserProductos(userId);
        handleCancelar();
      }
    });
  }
  
  

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      Meteor.call('productos.delete', id, (err) => {  // Aquí cambiamos 'productos.remove' a 'productos.delete'
        if (err) {
          alert(`Error al eliminar producto: ${err.reason || err.message}`);
        } else {
          setNotification({ show: true, message: 'Producto eliminado correctamente' });
          setTimeout(() => setNotification({ show: false, message: '' }), 3000);
          fetchUserProductos(userId);  // Refresca la lista de productos
        }
      });
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = (producto) => {
    setNuevoProducto({ ...producto });
    setEditingProduct(producto);
    setShowAddModal(true);
  };
  

  const handleCancelar = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setNuevoProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      estado: '',
      imagen_principal: '',
      imagenes_adicionales: '',
    });
  };

  return (
<div className="containerr">
  <Header cartCount={0} />
  {notification.show && <div className="notification">{notification.message}</div>} {/* Notificación amigable */}

  <div className="inventory-page">
    <button className="add-button" onClick={() => setShowAddModal(true)}>
      Añadir Nuevo Producto
    </button>

    <button className="order-button" onClick={fetchPedidos}>
      Mostrar Pedidos
    </button>

    {showPedidos ? (
      <div className="pedidos-grid">
        <h2>Mis Pedidos</h2>
        {pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <div key={`pedido-${pedido.id}-${index}`} className="pedido-card">
              <p><strong>Producto:</strong> {pedido.productoNombre || 'Producto desconocido'}</p>
              <p><strong>Cantidad:</strong> {pedido.cantidad || 1}</p>
              <p><strong>Estado:</strong> {pedido.estado || 'Pendiente'}</p>
            </div>
          ))
        ) : (
          <p>No tienes pedidos.</p>
        )}
        <button className="volver-button" onClick={handleVolver}>
          Volver a Productos
        </button>
      </div>
    ) : (
      productos.length > 0 ? (
        <div className="inventory-grid">
          {productos.map((producto) => (
      <div key={`producto-${producto.id}`} className="inventory-card">
        <img
          src={producto.imagen_principal || '/images/placeholder.png'}
          alt={producto.nombre}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-name">{producto.nombre}</h3>
          <p className="product-price"><strong>Precio:</strong> Q{parseFloat(producto.precio).toFixed(2)}</p>
          <p className="product-category"><strong>Categoría:</strong> {producto.categoria || 'Sin categoría'}</p>
          <p className="product-status"><strong>Estado:</strong> {producto.estado || 'Sin estado'}</p>
          
          {/* Campo para ingresar el cupón */}
          <button onClick={() => openAddCouponModal(producto.id)}>Añadir Cupón</button>
          {/* Botones para modificar y eliminar */}
          <button onClick={() => handleEditProduct(producto)}>Modificar</button>
          <button onClick={() => handleDeleteProduct(producto.id)}>Eliminar</button>
        </div>
      </div>
    ))}
        </div>
      ) : (
        <p>No hay productos en el inventario.</p>
      )
    )}

{/* Modal para añadir cupón */}
{showAddCouponModal && (
  <div className="modal-overlay" onClick={closeAddCouponModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Añadir Cupón</h2>
      <form>
        <label>Código de cupón:</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Código de cupón"
        />
        <label>Porcentaje de descuento:</label>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
          placeholder="Porcentaje de descuento"
        />
        <label>Fecha de expiración:</label>
        <input
          className="fecha-input-coupon"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <button type="button" onClick={handleApplyCoupon}>Aplicar Cupón</button>
        <button type="button" onClick={closeAddCouponModal}>Cancelar</button>
      </form>
    </div>
  </div>
)}



        {showAddModal && (
          <div className="modal-overlay" onClick={handleCancelar}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Modificar Producto' : 'Añadir Nuevo Producto'}</h2>
              <form>
                <label>Nombre:</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={nuevoProducto.nombre} 
                  onChange={handleChange} 
                />

                <label>Descripción:</label>
                <textarea 
                  name="descripcion" 
                  value={nuevoProducto.descripcion} 
                  onChange={handleChange} 
                />

                <label>Precio:</label>
                <input 
                  type="number" 
                  name="precio" 
                  value={nuevoProducto.precio} 
                  onChange={handleChange} 
                />

                <label>Categoría:</label>
                <select 
                  name="categoria" 
                  value={nuevoProducto.categoria} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <label>Estado:</label>
                <select 
                  name="estado" 
                  value={nuevoProducto.estado} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>

                <label>Imagen Principal (URL):</label>
                <input 
                  type="text" 
                  name="imagen_principal" 
                  value={nuevoProducto.imagen_principal} 
                  onChange={handleChange} 
                />

                <label>Imágenes Adicionales (URLs separadas por comas):</label>
                <input 
                  type="text" 
                  name="imagenes_adicionales" 
                  value={nuevoProducto.imagenes_adicionales} 
                  onChange={handleChange} 
                />

                <button 
                  type="button" 
                  onClick={handleAddOrUpdateProduct} 
                  className="add-button"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelar} 
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </form>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
