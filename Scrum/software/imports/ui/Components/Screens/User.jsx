import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/User.css';

const User = () => {
	const navigate = useNavigate();

	const handlePaymentManagement = () => {
		navigate('/user/paymentmanagement');
	};

	const handleInventoryManagement = () => {
		navigate('/user/inventorymanagement');	
	};

  	return (
    	<div className='user-page'>
      	  <div className='user-interface'>
            <div className='user-header'>
          	<h2>Usuario</h2>
          	<Link to="/homepage" className='back-button'>
            	  <i className='arrow'></i> Volver
          	</Link>
            </div>
	    <div className='user-menu'>
	      <div className='action-container'>
            	  <div className='payment-button'>
            	    <button onClick={handlePaymentManagement}>Gestión de Pagos</button>
            	    <button onClick={handleInventoryManagement}>Gestión de Inventario</button>
            	  </div>
	      </div>
	      <div className='delivery-container'>
	      </div>
            </div>
          </div>
        </div>
	);
};

export default User;

