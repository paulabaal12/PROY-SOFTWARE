import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import QRCode from 'qrcode';

Modal.setAppElement('#root');

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCodeQR, setVerificationCodeQR] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Previene la recarga de la página
    if (!email || !password) {
      setErrorMessage('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    Meteor.call('usuarios.authenticate', { email, password }, (error, response) => {
      if (error) {
        console.error('Error durante el inicio de sesión:', error);
        setErrorMessage(error.reason || 'Error desconocido durante el inicio de sesión.');
      } else if (response && !response.authenticated) {
        setErrorMessage('Correo electrónico o contraseña incorrectos.');
      } else if (response.twoFactorRequired) {
        setVerificationCodeQR(response.qrCode); // Suponiendo que 'qrCode' es la URL del código QR devuelta por el servidor
        setShow2FAModal(true);
      } else {
        navigate('/homepage'); // O la ruta que proceda tras un inicio de sesión exitoso
      }
    });
  };

  const verify2FACode = () => {
    Meteor.call('usuarios.verifyTwoFactorCode', email, verificationCode, (error, verified) => {
      if (error) {
        console.error('Verification failed:', error);
        setErrorMessage('Fallo de verificación: ' + error.reason);
      } else if (verified) {
        navigate('/homepage');
      } else {
        setErrorMessage('Código 2FA inválido.');
      }
    });
  };

  return (
    <div className="login-container body1">
      <div className="form-container">
        <h1 className="centered">¡Bienvenido!</h1>
        <form id="login-form" onSubmit={handleLogin}>
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
          <Modal
            isOpen={show2FAModal}
            onRequestClose={() => setShow2FAModal(false)}
            contentLabel="Verificación 2FA"
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Ingrese el Código de Verificación</h2>
            <img src={verificationCodeQR} alt="Código QR" />
            <input 
              type="text" 
              placeholder="Código de Verificación" 
              value={verificationCode}  // Vincula este valor al estado
              onChange={(e) => setVerificationCode(e.target.value)}  // Actualiza el estado cuando el usuario escribe
            />
            <button onClick={verify2FACode}>Verificar Código</button>
            <button onClick={() => setShow2FAModal(false)}>Cerrar</button>
          </Modal>
        )}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className="register-prompt">
          <p>¿No tienes una cuenta?</p>
          <button onClick={() => navigate('/register')} className="btn1 centered">Regístrate</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

