import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

const FormularioProducto = ({ producto, modo, onFinish }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [imagenesAdicionales, setImagenesAdicionales] = useState([]);

  useEffect(() => {
    if (modo === 'editar' && producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setCategoria(producto.categoria);
      setEstado(producto.estado);
      setImagenPrincipal(producto.imagen_principal);
      setImagenesAdicionales(producto.imagenes_adicionales);
    } else {
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoria('');
      setEstado('');
      setImagenPrincipal('');
      setImagenesAdicionales([]);
    }
  }, [modo, producto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productoData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      estado,
      imagen_principal: imagenPrincipal,
      imagenes_adicionales: imagenesAdicionales
    };

    if (modo === 'editar') {
      Meteor.call('productos.update', producto.id, productoData, (error) => {
        if (error) {
          alert('Error al actualizar el producto: ' + error.reason);
        } else {
          alert('Producto actualizado correctamente');
          onFinish();
        }
      });
    } else {
      Meteor.call('productos.insert', productoData, (error) => {
        if (error) {
          alert('Error al crear el producto: ' + error.reason);
        } else {
          alert('Producto creado correctamente');
          onFinish();
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h2>{modo === 'editar' ? 'Editar Producto' : 'Crear Producto'}</h2>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </label>
      <label>
        Descripción:
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </label>
      <label>
        Precio:
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </label>
      <label>
        Categoría:
        <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
      </label>
      <label>
        Estado:
        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required />
      </label>
      <label>
        Imagen Principal:
        <input type="text" value={imagenPrincipal} onChange={(e) => setImagenPrincipal(e.target.value)} required />
      </label>
      <label>
        Imágenes Adicionales:
        <input type="text" value={imagenesAdicionales} onChange={(e) => setImagenesAdicionales(e.target.value.split(','))} />
      </label>
      <button type="submit" className="crud-button">{modo === 'editar' ? 'Actualizar' : 'Crear'}</button>
    </form>
  );
};

export default FormularioProducto;
