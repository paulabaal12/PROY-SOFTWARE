import React from 'react';

const ListaProductos = ({ productos, onEditar, onEliminar }) => {
  return (
    <div>
        <h2 className="crud-title">Listado de Productos</h2>
        <table className="crud-table">
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {productos.map((producto) => (
                <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>
                    <button onClick={() => onEditar(producto)} className="crud-button">Editar</button>
                    <button onClick={() => onEliminar(producto.id)} className="crud-button crud-button-delete">Eliminar</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>

  );
};

export default ListaProductos;
