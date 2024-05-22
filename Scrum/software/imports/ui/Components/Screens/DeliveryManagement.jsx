import React, { useState, useEffect } from 'react';
import './css/DeliveryManagement.css';
import { Meteor } from 'meteor/meteor';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz


const DeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDeliveries, setSelectedDeliveries] = useState([]);

    useEffect(() => {
        Meteor.call('pedidos.getAllWithAddresses', (error, result) => {
            if (error) {
                console.error('Error fetching deliveries:', error);
            } else {
                setDeliveries(result);
            }
        });
    }, []);

    const handleSelectDelivery = (id) => {
        setSelectedDeliveries((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter(deliveryId => deliveryId !== id) : [...prevSelected, id]
        );
    };

    const handleConfirmDeliveries = () => {
        alert(`Entregas seleccionadas: ${selectedDeliveries.join(', ')}`);
    };

    return (
        <div className='delivery-page'>
            <h2>Gestión de Entregas</h2>
            <ul className='delivery-list'>
                {deliveries.map(delivery => (
                    <li key={delivery.id_pedido} className='delivery-item'>
                        <input
                            type='checkbox'
                            checked={selectedDeliveries.includes(delivery.id_pedido)}
                            onChange={() => handleSelectDelivery(delivery.id_pedido)}
                        />
                        <span>{`Inicio: ${delivery.direccion_inicio} - Entrega: ${delivery.direccion_entrega}`}</span>
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirmDeliveries} className='confirm-button'>Confirmar Entregas</button>
        </div>
    );
};

export default DeliveryManagement;

