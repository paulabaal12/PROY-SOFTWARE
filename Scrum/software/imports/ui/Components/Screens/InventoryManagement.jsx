import React, { useState, useEffect } from 'react';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz
import { Meteor } from 'meteor/meteor';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        Meteor.call('productos.getAll', (error, result) => {
            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(result);
            }
        });
    }, []);

    const handleAddProduct = () => {
        alert('Agregar nuevo producto');
    };

    const handleEditProduct = (id) => {
        alert(`Editar producto con ID: ${id}`);
    };

    const handleDeleteProduct = (id) => {
        alert(`Eliminar producto con ID: ${id}`);
    };

    return (
        <div className='inventory-page'>
            <h2>Gestión de Inventario</h2>
            <button onClick={handleAddProduct} className='add-button'>Agregar Producto</button>
            <ul className='inventory-list'>
                {products.map(product => (
                    <li key={product.id} className='inventory-item'>
                        <span>{`${product.nombre} - ${product.categoria} - $${product.precio.toFixed(2)}`}</span>
                        <button onClick={() => handleEditProduct(product.id)} className='edit-button'>Editar</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className='delete-button'>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryManagement;

