import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import ListaProductos from './ListaProductos';
import ListaPedidos from './ListaPedidos';
import VenderProductoForm from './VenderProductoForm';
import '../../style.css';
import '../../variables.css';

const VenderProductoPage = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [vistaActual, setVistaActual] = useState('productos');  // Controla qué vista se muestra: 'productos', 'pedidos', 'vender'

  useEffect(() => {
    cargarProductos();
    cargarPedidos();
  }, []);

  const cargarProductos = () => {
    Meteor.call('productos.getAll', (error, productosRecibidos) => {
      if (error) {
        alert('Error al obtener productos: ' + error.reason);
      } else {
        setProductos(productosRecibidos);
      }
    });
  };

  const cargarPedidos = () => {
    Meteor.call('pedidos.getAll', (error, pedidosRecibidos) => {
      if (error) {
        alert('Error al obtener pedidos: ' + error.reason);
      } else {
        setPedidos(pedidosRecibidos);
      }
    });
  };

  return (
    <div className="containerr">
      <Header />
      <div className="crud-container">
        <h1 className="crud-title">Gestión de Productos</h1>
        <button onClick={() => setVistaActual('vender')} className="crud-button">Vender Productos</button>
        <button onClick={() => setVistaActual('pedidos')} className="crud-button">Ver Pedidos</button>
        <button onClick={() => setVistaActual('productos')} className="crud-button">Lista Productos</button>

        {vistaActual === 'vender' && (
          <VenderProductoForm producto={productoSeleccionado} onFinish={cargarProductos} />
        )}
        {vistaActual === 'pedidos' && (
          <ListaPedidos pedidos={pedidos} onEstadoCambiado={(pedidoId, nuevoEstado) => {
            Meteor.call('pedidos.updateEstado', pedidoId, nuevoEstado, (error) => {
              if (error) {
                alert('Error al actualizar el estado del pedido: ' + error.reason);
              } else {
                alert('Estado del pedido actualizado correctamente');
                cargarPedidos();
              }
            });
          }} />
        )}
        {vistaActual === 'productos' && (
          <ListaProductos productos={productos} onEditar={setProductoSeleccionado} onEliminar={(id) => {
            if (window.confirm('¿Estás seguro de querer eliminar este producto?')) {
              Meteor.call('productos.delete', id, (error) => {
                if (error) {
                  alert('Error al eliminar producto: ' + error.reason);
                } else {
                  alert('Producto eliminado correctamente');
                  cargarProductos();
                }
              });
            }
          }} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VenderProductoPage;
