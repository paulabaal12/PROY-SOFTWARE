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
    profilePicture: null,
    hasAgreedToPrivacyPolicy: false,
    enable2FA: false,  // State to manage 2FA enabling
  });
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState(''); // Store QR code SVG

  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePrivacyPolicyCheckbox = (event) => {
    setFormData({
      ...formData,
      hasAgreedToPrivacyPolicy: event.target.checked,
    });
    setShowPrivacyAlert(!event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.hasAgreedToPrivacyPolicy) {
      setShowPrivacyAlert(true);
      return;
    }

    Meteor.call('usuarios.insert', formData, (error, result) => {
      if (error) {
        console.error('Error al insertar usuario:', error);
      } else {
        if (formData.enable2FA) {
          Meteor.call('generate2faActivationQrCode', 'YourAppName', (err, result) => {
            if (err) {
              console.error('Error generating QR code:', err);
            } else {
              // Assuming result.svg contains your QR code SVG
              setQrCodeSvg(result.svg);
              navigate('/complete-2fa-setup'); // Redirect to a page to complete 2FA setup
            }
          });
        } else {
          navigate('/'); // Navigate to home or login page
        }
      }
    });
  };

  const handlePrivacyPolicyClick = (event) => {
    event.preventDefault();
    setShowPrivacyPolicyModal(true);
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
        <form id="register-form" onSubmit={handleSubmit}>
        <input
            type="text"
            id="name"
            placeholder="Nombre"
            className="input-field"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Correo Electrónico"
            className="input-field"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            className="input-field"
            onChange={handleChange}
          />
          <input
            type="text"
            id="dpi"
            placeholder="DPI"
            className="input-field"
            onChange={handleChange}
          />
          <input
            type="text"
            id="location"
            placeholder="Ubicación"
            className="input-field"
            onChange={handleChange}
          />
          <input
            type="file"
            id="profilePicture"
            className="input-field"
            onChange={handleChange}
          />
          <label className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="hasAgreedToPrivacyPolicy"
              checked={formData.hasAgreedToPrivacyPolicy}
              onChange={handlePrivacyPolicyCheckbox}
            />
            Acepto la{" "}
            <a href="#" onClick={handlePrivacyPolicyClick}>
              política de privacidad
            </a>
          </label>
          {showPrivacyAlert && (
            <div className="alert alert-warning" role="alert">
              Debes aceptar la política de privacidad para registrarte.
            </div>
          )}
          <label className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="enable2FA"
              checked={formData.enable2FA}
              onChange={handleChange}
            />
            Habilitar Autenticación de Dos Factores (2FA)
          </label>
          <button type="submit" className="btn">Crear Cuenta</button>
        </form>
        {showPrivacyAlert && (
          <div className="alert alert-warning">
            Debes aceptar la política de privacidad para registrarte.
          </div>
        )}
        {showPrivacyPolicyModal && (
          <div className="overlay" onClick={() => setShowPrivacyPolicyModal(false)}>
            <div className="privacy-policy-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Política de Privacidad</h2>
              <p>Políticas de privacidad</p>
              <button onClick={() => setShowPrivacyPolicyModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
        {qrCodeSvg && (
          <div>
            <img src={`data:image/svg+xml;base64,${btoa(qrCodeSvg)}`} alt="QR Code" />
            <p>Scan this QR code with your authenticator app</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
