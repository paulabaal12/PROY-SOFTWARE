import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';

const CategoriaDetalle = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    precioMin: 0,
    precioMax: 1000000,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Nombre de la categoría:', nombre);
    Meteor.call('productos.getAll', (error, result) => {
      if (error) {
        console.error('Error al obtener productos:', error);
      } else {
        console.log('Todos los productos:', result);
        const productosFiltrados = result.filter(producto => 
          producto.categoria.toLowerCase() === nombre.toLowerCase()
        );
        console.log('Productos filtrados por categoría:', productosFiltrados);
        setProductos(productosFiltrados);
      }
      setIsLoading(false);
    });
  }, [nombre]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: parseFloat(value)
    }));
  };

  const productosFiltrados = productos.filter(producto => 
    producto.precio >= filtros.precioMin && producto.precio <= filtros.precioMax
  );

  console.log('Productos filtrados por precio:', productosFiltrados);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header />
      <div className="categoria-detalle-container">
        <h1>{nombre}</h1>
        <div className="categoria-content">
          <aside className="filtros-sidebar">
            <h2>Filtros</h2>
            <div>
              <label>Precio Mínimo:</label>
              <input 
                type="number" 
                name="precioMin" 
                value={filtros.precioMin} 
                onChange={handleFiltroChange}
              />
            </div>
            <div>
              <label>Precio Máximo:</label>
              <input 
                type="number" 
                name="precioMax" 
                value={filtros.precioMax} 
                onChange={handleFiltroChange}
              />
            </div>
          </aside>
          <main className="productos-grid">
            {productosFiltrados.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="product-container">
                  <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
                  <h3 className='titulo-producto'>{producto.nombre}</h3>
                  <p className='titulo-precio'>Precio: ${producto.precio}</p>
                  <button className="button-agregar">Agregar al carrito</button>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriaDetalle;