import React, { useState } from 'react'; 
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import '../../style.css';
import '../../variables.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [error, setError] = useState('');
  const [googleLoginInProgress, setGoogleLoginInProgress] = useState(false);
  const navigate = useNavigate();

  // Manejo del login manual
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
  
    Meteor.call('usuarios.authenticate', email, password, (error, result) => {
      if (error) {
        setError('Error en el inicio de sesión. Por favor intenta de nuevo.');
      } else if (result.authenticated && !result.twoFactorRequired) {
        console.log('Login exitoso, userId:', result.userId); // Depuración
        localStorage.setItem('userId', result.userId); // Almacenar userId
        onLoginSuccess();
      } else if (result.authenticated && result.twoFactorRequired) {
        setShow2FAModal(true);
      } else {
        setError('Fallo en la autenticación, verifica tus credenciales.');
      }
    });
  };
  
  
  

  // Manejo del login con Google
  const handleGoogleLogin = () => {
    if (googleLoginInProgress) {
      console.log("El inicio de sesión con Google ya está en progreso.");
      return; // Evitar intentos múltiples
    }

    setGoogleLoginInProgress(true);
    console.log("Iniciando proceso de login con Google");

    Meteor.loginWithGoogle((error, result) => {
      if (error) {
        console.error('Error en el inicio de sesión con Google:', error);
        setError('Error al iniciar sesión con Google.');
        setGoogleLoginInProgress(false);
      } else {
        console.log('Resultado de Google:', result);
        if (result && result.profile) {
          const googleUser = {
            name: result.profile.name || '',
            email: result.profile.email || '',
            picture: result.profile.picture || '',
          };
          console.log('Usuario de Google obtenido:', googleUser);

          // Verificar o registrar al usuario en la base de datos
          Meteor.call('usuarios.googleRegister', googleUser, (err, res) => {
            if (err) {
              console.error('Error al registrar el usuario de Google:', err);
              setError('Error al registrar con Google.');
            } else {
              console.log('Usuario registrado o autenticado con éxito:', res);
              onLoginSuccess(); // Redirigir tras éxito
            }
            setGoogleLoginInProgress(false);
          });
        } else {
          console.error('No se obtuvo el perfil del usuario de Google.');
          setError('No se pudo obtener el perfil del usuario de Google.');
          setGoogleLoginInProgress(false);
        }
      }
    });
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container body1">
      <div className="form-container">
      <center>
      <img src='/images/Imagen2.png' alt="Lupa" width="75" height="75" />
      </center>
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
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="Contraseña" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                {showPassword ? (
                  <g>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </g>
                ) : (
                  <g>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </g>
                )}
              </svg>
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>

        {show2FAModal && (
          <div className="overlay">
            <div className="modal">
              <h2>Ingrese el Código de Verificación</h2>
              <input 
                type="text" 
                placeholder="Código de Verificación" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
              <button onClick={() => { /* handle2FAVerification() */ }}>Verificar Código</button>
            </div>
          </div>
        )}

        <div className="register-prompt">
          <p>¿No tienes una cuenta?</p>
          <button onClick={() => navigate('/register')} className="btn1 centered">Regístrate</button>
        </div>
        <center>
        <button onClick={handleGoogleLogin} className="google-login-container">
          <div className="logo-google-login">
            <img src="images/google-logo.png" alt="Google Logo" />
          </div>
          <span className="btn-google-login">Iniciar con Google</span>
        </button>
        </center>
      </div>
    </div>
  );
};

export default LoginPage;
