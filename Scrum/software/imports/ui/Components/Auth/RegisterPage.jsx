import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dpi: "",
    location: "",
    hasAgreedToPrivacyPolicy: false,
    enable2FA: false,
  });
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFormData({...formData, [id]: type === 'checkbox' ? checked : value});
  };

  const handlePrivacyPolicyCheckbox = (event) => {
    setFormData({...formData, hasAgreedToPrivacyPolicy: event.target.checked});
    setShowPrivacyAlert(!event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.hasAgreedToPrivacyPolicy) {
      setShowPrivacyAlert(true);
      return;
    }
    Meteor.call('usuarios.insert', formData, (error, response) => {
      if (error) {
        setErrorMessage(error.reason || 'Error desconocido al registrar.');
      } else {
        // Redirige al inicio de sesión después de registrar al usuario correctamente
        navigate('/');
      }
    });
  };

  return (
    <div className="register-container body1">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form id="register-form" onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'dpi', 'location'].map((field) => (
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
          <label className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="hasAgreedToPrivacyPolicy"
              checked={formData.hasAgreedToPrivacyPolicy}
              onChange={handlePrivacyPolicyCheckbox}
            />
            Acepto la política de privacidad
          </label>
          <label className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="enable2FA"
              checked={formData.enable2FA}
              onChange={(e) => setFormData({...formData, enable2FA: e.target.checked})}
            />
            Habilitar Autenticación de Dos Factores (2FA)
          </label>
          {showPrivacyAlert && <div className="alert alert-warning">Debes aceptar la política de privacidad para registrarte.</div>}
          <button type="submit" className="btn">Crear Cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
