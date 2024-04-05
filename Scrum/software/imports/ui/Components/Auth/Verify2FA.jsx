import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Speakeasy from 'speakeasy';

const Verify2FA = ({ onVerified }) => {
  const [token, setToken] = useState('');

  const handleVerifyToken = () => {
    Meteor.call('user.verifyTotp', { token: token }, (error, result) => {
      if (error) {
        console.error('Error verifying token:', error);
      } else {
        onVerified(); 
      }
    });
  };

  return (
    <div>
      <h2>Verificar Autenticación de Dos Factores</h2>
      <input
        type="text"
        placeholder="Token 2FA"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleVerifyToken}>Verificar</button>
    </div>
  );
};

export default Verify2FA;
