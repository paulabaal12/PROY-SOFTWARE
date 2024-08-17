import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const ProductoDetalles = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Valor de productoId:', productoId);  // Para depuración

    const numericProductoId = (productoId);
    if (isNaN(numericProductoId)) {
      console.error('El ID del producto no es un número válido:', productoId);
      setProducto(null);
      setLoading(false);
      return;
    }

    // Llamada al método de Meteor para obtener el producto por ID
    Meteor.call('productos.getAll_id', numericProductoId, (error, result) => {
      if (error) {
        console.error('Error al obtener el producto:', error);
      } else if (result.length > 0) {
        setProducto(result[0]);
      } else {
        console.log('Producto no encontrado');
        setProducto(null);
      }
      setLoading(false);
    });
  }, [productoId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>Estado: {producto.estado}</p>
      {producto.imagen_principal && (
        <div>
          <h3>Imagen Principal:</h3>
          <img src={producto.imagen_principal} alt={producto.nombre} style={{ maxWidth: '300px' }} />
        </div>
      )}
      {producto.imagenes_adicionales && producto.imagenes_adicionales.length > 0 && (
        <div>
          <h3>Imágenes Adicionales:</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {producto.imagenes_adicionales.map((imagen, index) => (
              <img
                key={index}
                src={imagen}
                alt={`${producto.nombre} - Imagen ${index + 1}`}
                style={{ maxWidth: '150px' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetalles;





