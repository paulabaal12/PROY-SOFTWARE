import React from 'react';

const RegisterPage = () => (
  <div className="container">
    <h1>Registro</h1>
    <form id="register-form">
      <input type="text" id="name" placeholder="Nombre" />
      <input type="password" id="Password" placeholder="Password" />
      <input type="text" id="dpi" placeholder="DPI" />
      <input type="text" id="location" placeholder="Ubicación" />
      <input type="file" id="profile-picture" />
      <button type="submit">Crear Cuenta</button>
    </form>
  </div>
);

export default RegisterPage;