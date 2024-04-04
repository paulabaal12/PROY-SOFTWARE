import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => (
  <div className="container">
    <h1>¡Bienvenido!</h1>
    <form id="login-form">
      <input type="text" id="username" placeholder="Usuario" />
      <input type="password" id="password" placeholder="Contraseña" />
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p>¿No tienes una cuenta?</p>
    <Link to="/register">
      <button id="register-button">Regístrate</button>
    </Link>
  </div>
);

export default LoginPage;