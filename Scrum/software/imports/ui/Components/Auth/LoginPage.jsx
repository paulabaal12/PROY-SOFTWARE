import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const LoginPage = ({ setShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Llamar al método de Meteor para verificar la autenticación
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Error al autenticar:', error);
      } else {
        if (result.authenticated) {
          console.log('¡Usuario autenticado! Inicia sesión.');
        } else {
          console.log('¡Usuario no autenticado! Revise sus credenciales.');
        }
      }
    });
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1 className="centered">¡Bienvenido!</h1>
        <form id="login-form" onSubmit={handleSubmit}>
          <input type="email" id="email" placeholder="Correo Electrónico" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" id="password" placeholder="Contraseña" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>
        <div className="register-prompt">
          <p>¿No tienes una cuenta?</p>
          <button onClick={() => setShowRegister(true)} className="btn1 centered">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

