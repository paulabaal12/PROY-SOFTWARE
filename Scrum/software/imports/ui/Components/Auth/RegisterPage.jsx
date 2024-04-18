import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

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
    <div className="register-container body1">
      <div className="form-container">
        <h1 className="centered">Registro</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          {/* Resto de tu formulario */}
        </form>
        {/* Resto de tu código para la alerta, modal y QR code */}
      </div>
    </div>
  );
};

export default RegisterPage;
