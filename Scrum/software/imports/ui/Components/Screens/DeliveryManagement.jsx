import React, {useState, useEffect} from 'react';
import './css/DeliveryManagement.css';

const DeliveryManagement = () => {
	const [deliveries, setDeliveries] = useState([]);
	const [selectedDeliveries, setSelectedDeliveries] = useState([]);

	useEffect(() => {
		setDeliveries([
			{ id: 1, direccion_inicio: '123 Calle A', direccion_entrega: '456 Calle B', estado: 'pendiente' },
			{ id: 2, direccion_inicio: '789 Calle C', direccion_entrega: '012 Calle D', estado: 'pendiente' },
		]);
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
					<li key={delivery.id} className='delivery-item'>
						<input 
							type='checkbox' 
							checked={selectedDeliveries.includes(delivery.id)} 
							onChange={() => handleSelectDelivery(delivery.id)}
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

