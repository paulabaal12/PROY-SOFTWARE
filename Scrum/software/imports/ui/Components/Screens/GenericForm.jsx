import React from 'react';
import GenericForm from './GenericForm';
import { Meteor } from 'meteor/meteor';

const FormularioProducto = ({ producto, modo, onFinish }) => {
  const initialValues = modo === 'editar' && producto ? {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    categoria: producto.categoria,
    estado: producto.estado,
    imagen_principal: producto.imagen_principal,
    imagenes_adicionales: producto.imagenes_adicionales.join(',') // Convertir array a string
  } : {};

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'text', required: true },
    { name: 'precio', label: 'Precio', type: 'number', required: true },
    { name: 'categoria', label: 'Categoría', type: 'text', required: true },
    { name: 'estado', label: 'Estado', type: 'text', required: true },
    { name: 'imagen_principal', label: 'Imagen Principal', type: 'text', required: true },
    { name: 'imagenes_adicionales', label: 'Imágenes Adicionales', type: 'text', required: false },
  ];

  const handleSubmit = (formData) => {
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      imagenes_adicionales: formData.imagenes_adicionales ? formData.imagenes_adicionales.split(',') : []
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
    <GenericForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText={modo === 'editar' ? 'Actualizar' : 'Crear'}
      initialValues={initialValues}
      className="crud-form"
      title={modo === 'editar' ? 'Editar Producto' : 'Crear Producto'}
    />
  );
};

export default FormularioProducto;
