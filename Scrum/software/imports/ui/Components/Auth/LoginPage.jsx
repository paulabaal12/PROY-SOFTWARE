import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const LoginPage = ({ setShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [show2FA, setShow2FA] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Error al autenticar:', error);
      } else if (result.authenticated && !result.requires2FA) {
        onLoginSuccess();
      } else if (result.authenticated && result.requires2FA) {
        setUser(result.user); 
        setShow2FA(true); 
      } else {
        console.log('¡Usuario no autenticado! Revise sus credenciales.');
      }
    });
  };
  const handle2FAVerification = (token) => {
    Meteor.call('verify2FAToken', { userId: user._id, token }, (error, result) => {
      if (error) {
        console.error('Error verifying 2FA:', error);
      } else if (result.success) {
        onLoginSuccess();
      } else {
        console.log('Código 2FA incorrecto.');
      }
    });
  };

  return (
    <div className="login-container">
      {!show2FA ? (
        // The usual login form is displayed if 2FA is not required
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
            <button onClick={() => setShowRegister(true)} className="btn1 centered">Regístrate</button>
          </div>
        </div>
      ) : (
        // If 2FA is required, the Verify2FA component is rendered instead
        <Verify2FA onVerify={handle2FAVerification} />
      )}
    </div>
  );
};

export default LoginPage;

