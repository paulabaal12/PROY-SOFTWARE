import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import '../../../ui/style.css';
import { useNavigate } from 'react-router-dom';
import ProductoAgregadoMensaje from './ProductoAgregadoMensaje';

const VenderProductoForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
  const [productoAgregado, setProductoAgregado] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imagenesAdicionalesString = imagenesAdicionales.map(url => url.toString());
      Meteor.call('productos.insert', {
        nombre,
        descripcion,
        precio,
        categoria,
        estado,
        imagen_principal: imagenPrincipal,
        imagenes_adicionales: imagenesAdicionalesString,
      }, (error, response) => {
        if (error) {
          console.log('Error al guardar el producto:', error.reason || error.message);
        } else {
          alert('Producto agregado correctamente');
          setProductoAgregado(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      });
    } catch (error) {
      console.log('Error al guardar el producto:', error.reason || error.message);
    }
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
        </>
      )}
      {productoAgregado ? (
        <ProductoAgregadoMensaje />
      ) : (
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
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Ropa">Ropa</option>
              <option value="Accesorio">Accesorio</option>
              <option value="Cocina">Cocina</option>
              <option value="Electronica">Electrónica</option>
              <option value="Comida">Comida</option>
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
          <div className="image-preview">
            <h3 className="image-preview-title">Vista Previa de Imágenes Adicionales:</h3>
            <div className="image-preview-container">
              {imagenesAdicionales.map((imagen, index) => (
                <img key={index} src={imagen} alt={`Imagen ${index + 1}`} className="image-preview-item" />
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default VenderProductoForm;
