import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Modal from 'react-modal';
import QRCode from 'qrcode';

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
    enable2FA: false,
  });
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.hasAgreedToPrivacyPolicy) {
      setShowPrivacyAlert(true);
      return;
    }
    setLoading(true);
    Meteor.call('usuarios.insert', formData, (error, response) => {
      setLoading(false);
      if (error) {
        console.error('Error al registrar usuario:', error);
      } else {
        if (formData.enable2FA) {
          activate2FA(response.userId);
        } else {
          navigate('/homepage');
        }
      }
    });
  };

  const activate2FA = (userId) => {
    Meteor.call('usuarios.enableTwoFactorAuth', userId, (err, result) => {
      if (err) {
        console.error('Error al generar la autenticación 2FA:', err);
      } else {
        setQrCodeSvg(result);
        setIs2FAModalOpen(true);
      }
    });
  };

  const handleVerify2FACode = () => {
    Meteor.call('usuarios.verifyTwoFactorCode', formData.email, twoFactorCode, (error, verified) => {
      if (error) {
        console.error('Verification error:', error);
      } else if (verified) {
        console.log('2FA Verified successfully!');
        setIs2FAModalOpen(false);
        navigate('/homepage'); // Navigate to homepage or dashboard as needed
      } else {
        console.log('Failed to verify 2FA.');
      }
    });
  };

  const close2FAModal = () => {
    setIs2FAModalOpen(false);
    navigate('/'); // Close and navigate home or another appropriate route
  };

  return (
    <div className="register-container body1">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
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
          <div className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="hasAgreedToPrivacyPolicy"
              checked={formData.hasAgreedToPrivacyPolicy}
              onChange={handleChange}
            />
            Acepto la <button onClick={(e) => e.preventDefault()}>política de privacidad</button>
          </div>
          {showPrivacyAlert && (
            <div className="alert alert-warning" role="alert">
              Debes aceptar la política de privacidad para registrarte.
            </div>
          )}
          <div className="privacy-policy-checkbox">
            <input
              type="checkbox"
              id="enable2FA"
              checked={formData.enable2FA}
              onChange={handleChange}
            />
            Habilitar Autenticación de Dos Factores (2FA)
          </div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Cargando...' : 'Crear Cuenta'}</button>
        </form>
        <Modal isOpen={is2FAModalOpen} onRequestClose={close2FAModal} contentLabel="2FA QR Code">
          <h2>Configura tu Autenticación de Dos Factores</h2>
          <img src={qrCodeSvg} alt="QR Code" />
          <input
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="Enter your 2FA code"
          />
          <button onClick={handleVerify2FACode}>Verify Code</button>
          <button onClick={close2FAModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
};

export default RegisterPage;
