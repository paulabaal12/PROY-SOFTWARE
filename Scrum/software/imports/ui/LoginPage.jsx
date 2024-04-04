import React from 'react';

const LoginPage = ({ setShowRegister }) => (
  <div className="login-container">
    <div className="form-container">
      <h1 className="centered">¡Bienvenido!</h1>
      <form id="login-form">
        <input type="email" id="email" placeholder="Correo Eléctronico" className="input-field" />
        <input type="password" id="password" placeholder="Contraseña" className="input-field" />
        <button type="submit" className="btn">Iniciar Sesión</button>
      </form>
      <div className="register-prompt">
        <p>¿No tienes una cuenta?</p>
        <button onClick={() => setShowRegister(true)} className="btn1 centered">Regístrate</button>
      </div>
    </div>
  </div>
);

export default LoginPage;