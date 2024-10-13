import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import ProductoAgregadoMensaje from './ProductoAgregadoMensaje';
import GenericForm from './GenericForm';
import '../../style.css';
import '../../variables.css';

const VenderProductoForm = ({ producto }) => {
  const [productoAgregado, setProductoAgregado] = useState(false);
  const [imagenError, setImagenError] = useState('');
  const navigate = useNavigate();

  const fields = [
    { name: 'nombre', label: 'Nombre del producto', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción del producto', type: 'textarea', required: true },
    { name: 'precio', label: 'Precio', type: 'number', required: true },
    { name: 'categoria', label: 'Categoría', type: 'select', required: true, options: [
      { value: 'Hogar', label: 'Hogar' },
      { value: 'Electrónicos', label: 'Electrónicos' },
      // ... otras categorías ...
    ]},
    { name: 'estado', label: 'Estado', type: 'select', required: true, options: [
      { value: 'Nuevo', label: 'Nuevo' },
      { value: 'Usado', label: 'Usado' },
    ]},
    { name: 'imagen_principal', label: 'Imagen Principal (URL)', type: 'text', required: true },
    { name: 'imagenes_adicionales', label: 'Imágenes Adicionales', type: 'text' },
  ];

  const handleSubmit = (formData) => {
    if (imagenError) {
      alert('Por favor, corrija los errores antes de enviar el formulario.');
      return;
    }

    const method = producto ? 'productos.update' : 'productos.insert';
    const params = producto ? [producto.id, formData] : [formData];
  
    Meteor.call(method, ...params, (error, response) => {
      if (error) {
        console.log('Error al guardar el producto:', error);
      } else {
        setProductoAgregado(true);
      }
    });
  };

  const validateImageUrl = (url) => {
    if (url.length > 200) {
      return 'La URL es demasiado larga. Debe tener menos de 200 caracteres.';
    }
    return '';
  };

  const handleCancelar = () => {
    navigate('/homepage');
  };

  if (productoAgregado) {
    return <ProductoAgregadoMensaje />;
  }

  return (
    <div className="form-container">
      <h1 className='form-title'>Vender Producto</h1>
      <GenericForm
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText={producto ? 'Actualizar Producto' : 'Vender Producto'}
        initialValues={producto || {}}
      />
      <button type="button" className="form-button form-button-cancel" onClick={handleCancelar}>Cancelar</button>
    </div>
  );
};

export default VenderProductoForm;