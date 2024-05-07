import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DetallesProducto = ({ producto }) => {
  return (
    <div>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: {producto.precio}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>Estado: {producto.estado}</p>
      <img src={producto.imagen_principal} alt={producto.nombre} style={{ maxWidth: '300px' }} />
      <h3>Imágenes Adicionales:</h3>
      {producto.imagenes_adicionales.map((imagen, index) => (
        <img key={index} src={imagen} alt={`Imagen ${index + 1}`} style={{ maxWidth: '200px' }} />
      ))}
    </div>
  );
};

const ProductoDetalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`/productos/${id}`);
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };
    fetchProducto();
  }, [id]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  return <DetallesProducto producto={producto} />;
};

export default ProductoDetalles;