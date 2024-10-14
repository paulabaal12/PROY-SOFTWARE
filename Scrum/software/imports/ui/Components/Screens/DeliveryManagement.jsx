import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import '../../style.css';
import '../../variables.css';

const DeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDeliveries, setSelectedDeliveries] = useState([]);
    const [activeTab, setActiveTab] = useState('deliveries');

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

            {/* Tabs */}
            <div className='tabs'>
                <button 
                    className={`tab ${activeTab === 'deliveries' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('deliveries')}
                >
                    Entregas
                </button>
                <button 
                    className={`tab ${activeTab === 'chat' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
            </div>

            <div className='tab-content'>
                {activeTab === 'deliveries' && (
                    <div>
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
                )}
                {activeTab === 'chat' && (
                    <div className='chat-container'>
                        <h3>Chat</h3>
                        <p></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryManagement;

