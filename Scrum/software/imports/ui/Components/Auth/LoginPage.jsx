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
    // Authenticate user
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        console.error('Error al autenticar:', error);
      } else if (result.authenticated) {
        // Call the server method to send a verification code
        Meteor.call('sendVerificationCode', email, (err, res) => {
          if (err) {
            console.error('Error sending verification code:', err);
          } else {
            // Assuming verification code is sent successfully
            setShow2FAModal(true);
          }
        });
      } else {
        console.log('¡Usuario no autenticado! Revise sus credenciales.');
      }
    });
  };
  
  const handle2FAVerification = () => {
    Meteor.call('user.verifyTotp', { email, token: verificationCode }, (error, verified) => {
      setShow2FAModal(false);
      if (error) {
        console.error('Error verificando 2FA:', error);
      } else if (verified) {
        onLoginSuccess();
        navigate('/homepage');
      } else {
        console.log('Código 2FA incorrecto o expirado.');
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
