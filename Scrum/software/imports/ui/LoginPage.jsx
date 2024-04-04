import React from 'react';

const LoginPage = ({ setShowRegister }) => (
  <div className="container">
    <h1>¡Bienvenido!</h1>
    <form id="login-form">
      <input type="email" id="email" placeholder="Correo Electrónico" />
      <input type="password" id="password" placeholder="Contraseña" />
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p>¿No tienes una cuenta?</p>
    <button onClick={() => setShowRegister(true)}>Regístrate</button>
  </div>
);

export default LoginPage;