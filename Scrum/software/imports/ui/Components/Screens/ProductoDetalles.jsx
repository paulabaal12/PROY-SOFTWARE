import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../ui/style.css';

const DetallesProducto = ({ producto }) => {
  return (
    <div className="producto-detalles">
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: {producto.precio}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>Estado: {producto.estado}</p>
      <img src={producto.imagen_principal} alt={producto.nombre} className="producto-imagen" />
      <h3>Imágenes Adicionales:</h3>
      <div className="imagenes-adicionales">
        {producto.imagenes_adicionales.map((imagen, index) => (
          <img key={index} src={imagen} alt={`Imagen ${index + 1}`} className="imagen-adicional" />
        ))}
      </div>
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
