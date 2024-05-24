import React, { useState } from 'react';

const ListaPedidos = ({ pedidos, onEstadoCambiado }) => {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    pedido: {
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    titulo: {
      textAlign: 'center',
      color: '#333',
    },
    detalle: {
      margin: '5px 0',
      paddingLeft: '10px',
      borderLeft: '3px solid #007BFF'
    },
    button: {
      margin: '10px',
      padding: '5px 10px',
      cursor: 'pointer'
    },
    select: {
      margin: '10px',
      padding: '5px 10px',
      width: '100%'
    }
  };

  const handleVerDetalles = (pedido) => {
    setPedidoSeleccionado(pedidoSeleccionado === pedido ? null : pedido);
    setEstadoSeleccionado(pedido ? pedido.estado : '');  // Initialize with current estado
  };

  const handleCambiarEstado = () => {
    onEstadoCambiado(pedidoSeleccionado.id_pedido, estadoSeleccionado);
    setPedidoSeleccionado({...pedidoSeleccionado, estado: estadoSeleccionado});
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido.id_pedido} style={styles.pedido}>
          <p style={styles.detalle}>Pedido ID: {pedido.id_pedido}</p>
          <p style={styles.detalle}>Total: ${parseFloat(pedido.total).toFixed(2)}</p>
          <p style={styles.detalle}>Estado: {pedido.estado}</p>
          <button style={styles.button} onClick={() => handleVerDetalles(pedido)}>Ver Detalles</button>
          {pedidoSeleccionado === pedido && (
            <>
              <p style={styles.detalle}>Detalles: {JSON.stringify(pedido.detalles)}</p>
              <select 
                style={styles.select}
                value={estadoSeleccionado}
                onChange={e => setEstadoSeleccionado(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregado">Entregado</option>
              </select>
              <button style={styles.button} onClick={handleCambiarEstado}>Modificar Estado</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaPedidos;
