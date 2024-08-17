import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Modal from 'react-modal';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz


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
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
  };

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
  //to implement /refine
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

  return (
    <div className="register-container body1">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'dpi', 'location'].map(field => (
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
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;