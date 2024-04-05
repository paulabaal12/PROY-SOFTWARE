import React, { useState } from "react";


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dpi: "",
    location: "",
    profilePicture: null,
    hasAgreedToPrivacyPolicy: false,
  });
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
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

    //console.log("Form data submitted:", formData);
      Meteor.call('usuarios.insert', formData, (error, result) => {
      if (error) {
        console.error('Error al insertar usuario:', error);
      } else {
        console.log('Usuario insertado correctamente:', result);
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
          <button type="submit" className="btn">
            Crear Cuenta
          </button>
        </form>
      </div>
      {showPrivacyPolicyModal && (
        <div
          className="overlay"
          onClick={() => setShowPrivacyPolicyModal(false)}
        >
          <div
            className="privacy-policy-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Política de Privacidad</h2>
            <p>Bienpolíticas de privacidad</p>
            <button onClick={() => setShowPrivacyPolicyModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div
        className={`form-container ${showPrivacyPolicyModal ? "blurred" : ""}`}
      >
        {/* El resto de tu formulario aquí */}
      </div>
    </div>
  );
};

export default RegisterPage;
