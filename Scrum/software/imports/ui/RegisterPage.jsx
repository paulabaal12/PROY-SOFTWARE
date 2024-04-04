import React from 'react';

const RegisterPage = () => (
  <div className="register-container">
    <div className="form-container">
      <h1 className="centered">Registro</h1>
      <form id="register-form">
        <input type="text" id="name" placeholder="Nombre" className="input-field" />
        <input type="email" id="email" placeholder="Correo Eléctronico" className="input-field" />
        <input type="password" id="Password" placeholder="Password" className="input-field" />
        <input type="text" id="dpi" placeholder="DPI" className="input-field" />
        <input type="text" id="location" placeholder="Ubicación" className="input-field" />
        <input type="file" id="profile-picture" className="input-field" />
        <button type="submit" className="btn">Crear Cuenta</button>
      </form>
    </div>
  </div>
);

export default RegisterPage;