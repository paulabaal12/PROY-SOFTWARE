import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Tooltip as PieTooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip } from 'recharts';
import { Meteor } from 'meteor/meteor';

import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

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

    const pieData = [
        { name: 'Categoría A', value: 400 },
        { name: 'Categoría B', value: 300 },
        { name: 'Categoría C', value: 300 },
        { name: 'Categoría D', value: 200 },
    ];

    const barData = [
        { name: 'Enero', ventas: 400 },
        { name: 'Febrero', ventas: 300 },
        { name: 'Marzo', ventas: 500 },
        { name: 'Abril', ventas: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <>
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

            <div style={{ padding: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Inventarios
                </Typography>
        
                <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                    <Typography variant="h5" component="h2">
                        Distribución del Inventario por Categorías
                    </Typography>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index% COLORS.length]} />
                                ))}
                            </Pie>
                            <PieTooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
    
                    <Paper style={{ padding: '20px' }}>
                        <Typography variant="h5" component="h2">
                            Ventas Mensuales
                        </Typography>
                        <BarChart
                            width={500}
                            height={300}
                            data={barData}
                            margin={{
                                top: 20, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <BarTooltip />
                            <Legend />
                            <Bar dataKey="ventas" fill="#8884d8" />
                        </BarChart>
                    </Paper>
                </div>
            </>
        );
    };
    
    export default InventoryManagement;
    