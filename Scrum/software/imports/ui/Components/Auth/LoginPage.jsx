import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear any previous errors
    // Llamada al servidor para autenticar al usuario
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Error en el inicio de sesión:', error.reason);
        setError('Error en el inicio de sesión. Por favor intenta de nuevo.');
      } else if (result.authenticated && !result.twoFactorRequired) {
        onLoginSuccess();
      } else if (result.authenticated && result.twoFactorRequired) {
        // Si se requiere 2FA, mostrar modal para ingresar el código
        setShow2FAModal(true);
      } else {
        setError('Fallo en la autenticación, verifica tus credenciales.');
      }
    });
  };

  const handle2FAVerification = () => {
    // Llamada al servidor para verificar el código 2FA
    Meteor.call('usuarios.verifyTwoFactorCode', email, verificationCode, (error, result) => {
      if (error) {
        console.error('Error en la verificación 2FA:', error.reason);
        setError('Error en la verificación 2FA. Por favor intenta de nuevo.');
        setShow2FAModal(false);
      } else if (result) {
        onLoginSuccess(); // El usuario ha iniciado sesión completamente
      } else {
        setError('Código 2FA incorrecto, por favor intenta nuevamente.');
        setVerificationCode(''); // Clear the input for another try
      }
    });
  };

  return (
    <div className="login-container body1">
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
          {error && <div className="alert alert-danger">{error}</div>}
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
