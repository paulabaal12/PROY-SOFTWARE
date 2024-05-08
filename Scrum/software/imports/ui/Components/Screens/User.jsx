import React from 'react';
import { Link } from 'react-router-dom';
import './css/User.css';

const User = () => {
  return (
    <div className='user-page'>
      <div className='user-interface'>
        <div className='user-header'>
          <h2>Usuario</h2>
          <Link to="/homepage" className='back-button'>
            <i className='arrow'></i> Volver
          </Link>
        </div>
        <div className='payment-button'>
          <button>Gestión de Pagos</button>
        </div>
      </div>
    </div>
  );
};

export default User;

