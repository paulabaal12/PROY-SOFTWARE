import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import ListaProductos from './ListaProductos';
import FormularioProducto from './FormularioProducto';
import ListaPedidos from './ListaPedidos';
import './css/CRUD.css';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const CRUDProductos = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoFormulario, setModoFormulario] = useState('crear');
  const [mostrarPedidos, setMostrarPedidos] = useState(false);

  useEffect(() => {
    cargarProductos();
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
        setMostrarPedidos(true); // Asegurarse de mostrar los pedidos después de cargarlos
      }
    });
  };

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModoFormulario('editar');
    setMostrarPedidos(false);
  };

  const handleCrear = () => {
    setProductoSeleccionado(null);
    setModoFormulario('crear');
    setMostrarPedidos(false);
  };

  const handleEliminar = (productoId) => {
    if (window.confirm('¿Estás seguro de querer eliminar este producto?')) {
      Meteor.call('productos.delete', productoId, (error) => {
        if (error) {
          alert('Error al eliminar producto: ' + error.reason);
        } else {
          alert('Producto eliminado correctamente');
          cargarProductos();
        }
      });
    }
  };

  const onEstadoCambiado = (pedidoId, nuevoEstado) => {
    Meteor.call('pedidos.updateEstado', pedidoId, nuevoEstado, (error) => {
      if (error) {
        alert('Error al actualizar el estado del pedido: ' + error.reason);
      } else {
        alert('Estado del pedido actualizado correctamente');
        cargarPedidos();  // Recargar pedidos para reflejar los cambios
      }
    });
  };

  return (
    <div className="crud-container">
      <h1 className="crud-title">Gestión de Productos</h1>
      <button onClick={handleCrear} className="crud-button">Crear Producto</button>
      <button onClick={cargarPedidos} className="crud-button">Ver Pedidos</button>
      <ListaProductos productos={productos} onEditar={handleEditar} onEliminar={handleEliminar} />
      {mostrarPedidos && <ListaPedidos pedidos={pedidos} onEstadoCambiado={onEstadoCambiado} />}
      {!mostrarPedidos && (productoSeleccionado || modoFormulario === 'crear') && (
        <FormularioProducto
          producto={productoSeleccionado}
          modo={modoFormulario}
          onFinish={cargarProductos}
        />
      )}
    </div>
  );
};

export default CRUDProductos;
