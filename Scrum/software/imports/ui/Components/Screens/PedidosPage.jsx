import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import { Filter, Calendar, DollarSign, Search } from 'lucide-react';

const PedidosPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [pedidosUsuario, setPedidosUsuario] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [devolucionMensaje, setDevolucionMensaje] = useState(''); // Estado para el mensaje de devolución

  const userId = parseInt(localStorage.getItem('userId'), 10);
  console.log("User ID en PedidosPage:", userId);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarFiltros = () => {
    let resultados = [...pedidosUsuario];

    if (filtros.fechaInicio) {
      resultados = resultados.filter(pedido => 
        new Date(pedido.fecha) >= new Date(filtros.fechaInicio)
      );
    }

    if (filtros.fechaFin) {
      resultados = resultados.filter(pedido => 
        new Date(pedido.fecha) <= new Date(filtros.fechaFin)
      );
    }

    if (filtros.precioMin) {
      resultados = resultados.filter(pedido => 
        Number(pedido.total) >= Number(filtros.precioMin)
      );
    }

    if (filtros.precioMax) {
      resultados = resultados.filter(pedido => 
        Number(pedido.total) <= Number(filtros.precioMax)
      );
    }

    if (filtros.estado) {
      resultados = resultados.filter(pedido => 
        pedido.estado.toLowerCase() === filtros.estado.toLowerCase()
      );
    }

    setPedidosFiltrados(resultados);
  };

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    precioMin: '',
    precioMax: '',
    estado: ''
  });
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      precioMin: '',
      precioMax: '',
      estado: ''
    });
    setPedidosFiltrados(pedidosUsuario);
  };

  useEffect(() => {
    setPedidosFiltrados(pedidosUsuario);
  }, [pedidosUsuario]);

  useEffect(() => {
    if (userId) {
      Meteor.call('pedidos.getByUser', userId, (error, result) => {
        if (error) {
          console.error('Error al obtener los pedidos:', error);
        } else {
          console.log('Pedidos obtenidos del usuario:', result);
          setPedidosUsuario(result);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const handleVerDetalles = async (pedido) => {
    try {
      const detalles = typeof pedido.detalles === 'string'
        ? JSON.parse(pedido.detalles)
        : pedido.detalles;

      const productDetails = await Promise.all(
        detalles.map(async (item) => {
          return new Promise((resolve, reject) => {
            Meteor.call('productos.getAll_id', item.producto_id, (error, result) => {
              if (error) {
                console.error(`Error al obtener el producto ${item.producto_id}:`, error);
                reject(error);
              } else {
                resolve({ ...item, ...result[0] });
              }
            });
          });
        })
      );

      setSelectedPedido({ ...pedido, detalles: productDetails });
      setModalVisible(true);
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
    }
  };

  const handleDevolucion = (pedidoId) => {
    Meteor.call('pedidos.marcarDevolucion', pedidoId, (error, result) => {
      if (error) {
        console.error('Error al marcar devolución:', error);
      } else {
        console.log('Pedido marcado para devolución:', result);
        setDevolucionMensaje("Producto Cancelado, el cliente ha declarado devolución"); // Actualiza el mensaje
        setTimeout(() => setDevolucionMensaje(''), 5000); // Oculta el mensaje después de 5 segundos
      }
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
 
  
  return (
    <div className="pagina-pedidos">
      <Header cartCount={cartCount} />
      <main className="contenedor-principal">
        <h1>Tus Pedidos</h1>
        
        {devolucionMensaje && (
          <div className="mensaje-devolucion">{devolucionMensaje}</div>
        )}

        <div className="filtros-container">
          <h2 className="filtros-titulo">
            <Filter size={20} />
            Filtrar Pedidos
          </h2>
          <div className="filtros-grid">
            <div className="filtro-grupo">
              <label className="filtro-label">
                <Calendar size={16} />
                Fecha Inicio
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleFiltroChange}
                className="filtro-input"
              />
            </div>
            <div className="filtro-grupo">
              <label className="filtro-label">
                <Calendar size={16} />
                Fecha Fin
              </label>
              <input
                type="date"
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleFiltroChange}
                className="filtro-input"
              />
            </div>
            <div className="filtro-grupo">
              <label className="filtro-label">
                <DollarSign size={16} />
                Precio Mínimo
              </label>
              <input
                type="number"
                name="precioMin"
                value={filtros.precioMin}
                onChange={handleFiltroChange}
                className="filtro-input"
                placeholder="Q0.00"
              />
            </div>
            <div className="filtro-grupo">
              <label className="filtro-label">
                <DollarSign size={16} />
                Precio Máximo
              </label>
              <input
                type="number"
                name="precioMax"
                value={filtros.precioMax}
                onChange={handleFiltroChange}
                className="filtro-input"
                placeholder="Q999.99"
              />
            </div>
            <div className="filtro-grupo">
              <label className="filtro-label">Estado</label>
              <select
                name="estado"
                value={filtros.estado}
                onChange={handleFiltroChange}
                className="filtro-select"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div className="botones-filtro">
            <button className="boton-limpiar-filtro" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
            <button className="boton-aplicar-filtro" onClick={aplicarFiltros}>
              Aplicar Filtros
            </button>
          </div>
        </div>

        {pedidosFiltrados.length > 0 ? (
          <ul className="lista-pedidos">
            {pedidosFiltrados.map((pedido) => (
              <li key={pedido.id_pedido} className="tarjeta-pedido">
                <div className="encabezado-pedido">
                  <h4>
                    <span className="numero-pedido">Pedido #{pedido.id_pedido}</span>
                    <span className="fecha-pedido">
                      {new Date(pedido.fecha).toLocaleString()}
                    </span>
                  </h4>
                  <p className="estado-pedido">{pedido.estado}</p>
                  <p>Total: Q{Number(pedido.total).toFixed(2)}</p>
                  
                  <div className="detalles-pedido">
                    <button
                      className="boton-ver-detalles"
                      onClick={() => handleVerDetalles(pedido)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="boton-devolucion"
                      onClick={() => handleDevolucion(pedido.id_pedido)}
                    >
                      Devolución
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron pedidos con los filtros seleccionados.</p>
        )}
      </main>
  
      {modalVisible && selectedPedido && (
        <div className="fondo-modal" onClick={handleCloseModal}>
          <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Pedido #{selectedPedido.id_pedido}</h2>
            <p className="estado-pedido">{selectedPedido.estado}</p>
            <p>Total: Q{Number(selectedPedido.total).toFixed(2)}</p>
            <p>Fecha: {new Date(selectedPedido.fecha).toLocaleString()}</p>
            <h3>Productos:</h3>
            <ul>
              {selectedPedido.detalles.map((producto, index) => (
                <li key={index} className="producto-pedido">
                  <img src={producto.imagen_principal} alt={producto.nombre} className="imagen-producto"/>
                  <h4 className="nombre-producto">{producto.nombre}</h4>
                  <p>Cantidad: {producto.cantidad}</p>
                  <p className="precio-producto">Precio: Q{producto.precio_unitario}</p>
                </li>
              ))}
            </ul>
            <center>
              <button className="boton-cerrar-modal" onClick={handleCloseModal}>
                Cerrar
              </button>
            </center>
          </div>
        </div>
      )}
  
      <Footer />
    </div>
  );
}

export default PedidosPage;