import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import ProductoAgregadoMensaje from './ProductoAgregadoMensaje ';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const VenderProductoForm = ({ producto }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
  const [productoAgregado, setProductoAgregado] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setCategoria(producto.categoria);
      setEstado(producto.estado);
      setImagenPrincipal(producto.imagen_principal);
      setImagenesAdicionales(producto.imagenes_adicionales);
    }
  }, [producto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoData = {
      nombre,
      descripcion,
      precio: Number(precio), 
      categoria,
      estado,
      imagen_principal: imagenPrincipal,
      imagenes_adicionales: imagenesAdicionales.map(url => url.toString()),
    };
  
    const method = producto ? 'productos.update' : 'productos.insert';
    const params = producto ? [producto.id, productoData] : [productoData]; 
  
    Meteor.call(method, ...params, (error, response) => {
      if (error) {
        console.log('Error al guardar el producto:', error);
      } else {
        alert('Producto procesado correctamente');
        setProductoAgregado(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    });
  };
  

  const handleImagenPrincipalChange = (e) => {
    setImagenPrincipal(e.target.value);
  };

  const handleImagenesAdicionalesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenesAdicionales(files.map((file) => URL.createObjectURL(file)));
  };

  const handleCancelar = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setEstado('');
    setImagenPrincipal('');
    setImagenesAdicionales([]);
    navigate('/homepage');
  };

  return (
    <div className="form-container">
      {!productoAgregado && (
        <>
          <h1 className='form-title'>Vender Producto</h1>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre del producto:</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción del producto:</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio" className="form-label">Precio:</label>
              <input
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria" className="form-label">Categoría:</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="form-select"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Hogar">Hogar</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Libros">Libros</option>
                <option value="Accesorio">Accesorio</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Deportes">Deportes</option>
                <option value="Belleza">Belleza</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Automóviles">Automóviles</option>
                <option value="Viajes">Viajes</option>
                <option value="Mascotas">Mascotas</option>
                <option value="Salud">Salud</option>
                <option value="Jardín">Jardín</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Arte">Arte</option>
                <option value="Música">Música</option>
                <option value="Videojuegos">Videojuegos</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="estado" className="form-label">Estado:</label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                className="form-select"
              >
                <option value="">Seleccionar estado</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="imagenPrincipal" className="form-label">Imagen Principal (URL):</label>
              <input
                type="text"
                id="imagenPrincipal"
                value={imagenPrincipal}
                onChange={handleImagenPrincipalChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imagenesAdicionales" className="form-label">Imágenes Adicionales:</label>
              <input
                type="file"
                id="imagenesAdicionales"
                multiple
                onChange={handleImagenesAdicionalesChange}
                className="form-input"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Vender Producto</button>
              <button type="button" className="form-button form-button-cancel" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
        </>
      )}
      {productoAgregado && <ProductoAgregadoMensaje />}
    </div>
  );
};

export default VenderProductoForm;
