import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = ({ onLoginSuccess, setShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = (event) => {
    event.preventDefault();
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Error al autenticar:', error);
      } else if (result.authenticated) {
        onLoginSuccess(); // Actualiza el estado de autenticación en App.jsx
        navigate('/homepage'); // Redirige a HomePage después de un inicio de sesión exitoso
      } else {
        console.log('¡Usuario no autenticado! Revise sus credenciales.');
      }
    });
  };
  

  return (
    <div className="login-container">
      <div className="form-container">
        <h1 className="centered">¡Bienvenido!</h1>
        <form id="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            id="email" 
            placeholder="Correo Electrónico" 
            className="input-field" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            id="password" 
            placeholder="Contraseña" 
            className="input-field" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>
        <div className="register-prompt">
          <p>¿No tienes una cuenta?</p>
          <button onClick={() => navigate('/register')} className="btn1 centered">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

