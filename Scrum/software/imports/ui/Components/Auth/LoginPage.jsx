import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Login error:', error.reason);
      } else if (result.authenticated) {
        if (result.twoFactorRequired) {
          setShow2FAModal(true);
        } else {
          onLoginSuccess();
        }
      } else {
        console.log('Authentication failed, please check your credentials.');
      }
    });
  };

  const handle2FAVerification = () => {
    Meteor.call('verifyTwoFactor', { email, twoFactorCode: verificationCode }, (error, result) => {
      setShow2FAModal(false);
      if (error) {
        console.error('2FA Verification error:', error.reason);
      } else if (result.success) {
        onLoginSuccess(); // User is fully logged in
      } else {
        console.log('2FA code incorrect, please try again.');
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
        {show2FAModal && (
          <div className="overlay">
            <div className="modal">
              <h2>Ingrese el Código de Verificación</h2>
              <input 
                type="text" 
                placeholder="Verification Code" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
              <button onClick={handle2FAVerification}>Verify Code</button>
            </div>
          </div>
        )}
        <div className="register-prompt">
          <p>¿No tienes una cuenta?</p>
          <button onClick={() => navigate('/register')} className="btn1 centered">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
