import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Modal from 'react-modal';
import '../../style.css';
import '../../variables.css';

Modal.setAppElement('#root');

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dpi: "",
    location: "",
    hasAgreedToPrivacyPolicy: false,
    enable_2fa: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoginInProgress, setGoogleLoginInProgress] = useState(false);

  // Actualizar campos del formulario
  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
  };

  // REGISTRAR USUARIO CON GOOGLE
  // REGISTRAR USUARIO CON GOOGLE
const handleGoogleRegister = () => {
  if (!formData.hasAgreedToPrivacyPolicy) {
    setShowPrivacyAlert(true);
    setError('Debes aceptar la política de privacidad para registrarte.');
    return;
  }
  if (googleLoginInProgress) {
    console.log("Proceso de login con Google ya en progreso.");
    return; // Evitar duplicación
  }
  setGoogleLoginInProgress(true);

  console.log("Iniciando proceso de login con Google");
  
  Meteor.loginWithGoogle((error, result) => {
    if (error) {
      console.error('Error en el inicio de sesión con Google:', error);
      setError('Error en el registro con Google.');
      setGoogleLoginInProgress(false);
    } else {
      console.log('Resultado de Google:', result);

      // Verifica si se obtuvo el perfil correctamente
      if (!result || !result.profile) {
        console.error('No se obtuvo el perfil del usuario de Google.');
        setError('No se obtuvo la información del perfil de Google.');
        setGoogleLoginInProgress(false);
        return;
      }
      
      const googleUser = {
        name: result.profile.name || '',
        email: result.profile.email || '',
        picture: result.profile.picture || ''
      };

      console.log('Usuario de Google obtenido:', googleUser);
      
      // Llamada al método de registro en el servidor
      Meteor.call('usuarios.googleRegister', googleUser, (err, res) => {
        if (err) {
          console.error('Error al registrar el usuario de Google:', err);
          setError('Error al registrar con Google.');
        } else {
          console.log('Usuario registrado o autenticado con Google:', res);
          navigate('/'); // Redirigir después de registro o autenticación exitosa
        }
        setGoogleLoginInProgress(false);
      });
    }
  });
};


  // SUBMIT FORMULARIO DE REGISTRO MANUAL
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.hasAgreedToPrivacyPolicy) {
      setShowPrivacyAlert(true);
      setError('Debes aceptar la política de privacidad para registrarte.');
      return;
    }

    setLoading(true);

    Meteor.call('usuarios.insert', formData, (error, response) => {
      setLoading(false);
      if (error) {
        setError(`Error al registrar: ${error.error} - ${error.reason}`);
      } else if (response && response.userId && formData.enable_2fa) {
        activate2FA(response.userId);
      } else {
        navigate('/');
      }
    });
  };

  const activate2FA = (userId) => {
    Meteor.call('usuarios.enableTwoFactorAuth', userId, (err, result) => {
      if (err) {
        setError('Error al generar la autenticación 2FA.');
      } else {
        setQrCodeSvg(result);
        setIs2FAModalOpen(true);
      }
    });
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container body1">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          {['name', 'email', 'dpi', 'location'].map(field => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              id={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="input-field"
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
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
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1-5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </g>
                )}
              </svg>
            </button>
          </div>
          <div className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="hasAgreedToPrivacyPolicy"
              checked={formData.hasAgreedToPrivacyPolicy}
              onChange={handleChange}
            />
            Acepto la política de privacidad
          </div>
          <div className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="enable_2fa"
              checked={formData.enable_2fa}
              onChange={handleChange}
            />
            Habilitar Autenticación de Dos Factores (2FA)
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Cargando...' : 'Crear Cuenta'}</button>
            <br /><br />
        
        </form>

{/* Botón de registro con Google */}
<button onClick={handleGoogleRegister} className="google-login-container">
            <div className="logo-google-login">
              <img src="images/google-logo.png" alt="Google Logo" />
            </div>
            <span className="btn-google-login">Registrarse con Google</span>
          </button>

      </div>
    </div>
  );
};

export default RegisterPage;
